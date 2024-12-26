import { db } from "@/database/db";
import { UserSchema } from "@/database/schemas/user.schema";
import { and, count, eq } from "drizzle-orm";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidV4 } from "uuid";
import { format } from "date-fns";
import { BudgetSchema } from "@/database/schemas/budget.schema";
import { CategoryGroupSchema } from "@/database/schemas/category-group.schema";
import {
  categoryGroupSeed,
  // systemCategories,
} from "./seed/category-group.seed";
import { CategorySchema } from "@/database/schemas/category.schema";
import { useTranslation } from "react-i18next";

export const useDatabaseSeed = () => {
  const { t } = useTranslation();
  const startDate = format(new Date(), "yyyy-MM-dd");
  const [ready, setReady] = useState(false);

  const seedUser = useCallback(async () => {
    const [user] = await db.select().from(UserSchema);

    if (user) {
      return user.uuid;
    } else {
      try {
        const [{ user_uuid }] = await db
          .insert(UserSchema)
          .values({
            name: "Adriano",
            uuid: uuidV4(),
            syncStatus: "pending",
          })
          .returning({ user_uuid: UserSchema.uuid });

        return user_uuid;
      } catch (error) {
        console.log("🍎 error", { error });
      }
    }
  }, []);

  const seedBudget = useCallback(async (user_uuid: string | undefined) => {
    if (!user_uuid) return;

    const [budget] = await db.select().from(BudgetSchema);

    if (budget) {
      return budget.uuid;
    } else {
      try {
        const [{ budget_uuid }] = await db
          .insert(BudgetSchema)
          .values({
            uuid: uuidV4(),
            name: "My Budget",
            user_uuid: user_uuid,
            start_date: startDate,
            currency: "BRL",
          })
          .returning({ budget_uuid: BudgetSchema.uuid });

        return budget_uuid;
      } catch (error) {
        console.log("🍎 error", { error });
      }
    }
  }, []);

  const seedGategoryGroup = useCallback(
    async (budget_uuid: string | undefined) => {
      if (!budget_uuid) return;

      const [{ total }] = await db
        .select({ total: count() })
        .from(CategoryGroupSchema)
        .where(eq(CategoryGroupSchema.budget_uuid, budget_uuid));

      if (total === 0) {
        try {
          for (const categoryGroup of categoryGroupSeed) {
            const [{ category_group_uuid }] = await db
              .insert(CategoryGroupSchema)
              .values({
                uuid: uuidV4(),

                name: t(`cagegoryGroups.${categoryGroup.key}`),
                budget_uuid: budget_uuid,
              })
              .returning({ category_group_uuid: CategoryGroupSchema.uuid });

            for (const category of categoryGroup.categories) {
              await db
                .insert(CategorySchema)
                .values({
                  uuid: uuidV4(),
                  budget_uuid: budget_uuid,
                  name: t(`cagegoryGroups.categories.${category.key}`),
                  category_group_uuid: category_group_uuid,
                })
                .returning({ category_uuid: CategorySchema.uuid });
            }
          }
        } catch (error) {
          console.log("🍎 error", { error });
        }
      }
    },
    []
  );

  const seed = useCallback(async () => {
    const user_uuid = await seedUser();
    const budget_uuid = await seedBudget(user_uuid);
    await seedGategoryGroup(budget_uuid);
    // await seedSystemCategories(budget_uuid);
    setReady(true);
  }, []);
  useEffect(() => {
    seed();
  }, []);

  return { ready };
};
