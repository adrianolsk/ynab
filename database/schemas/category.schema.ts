import {
  customType,
  index,
  int,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { UserSchema } from "./user.schema";
import { BudgetSchema } from "./budget.schema";
import { CategoryGroupSchema } from "./category-group.schema";

// CATEGORIES TABLE
export const CategorySchema = sqliteTable(
  "categories",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    budget_uuid: text("budget_uuid")
      .notNull()
      .references(() => BudgetSchema.uuid, { onDelete: "cascade" }),
    category_group_uuid: text("category_group_uuid")
      .notNull()
      .references(() => CategoryGroupSchema.uuid, { onDelete: "cascade" }),
    name: text("name").notNull(),
    target_amount: real("target_amount").default(0),
    allocated_amount: real("allocated_amount").default(0),
    is_income: int("is_income").default(0),
    created_at: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    deleted_at: text("deleted_at"),
    lastSyncedAt: text("last_synced_at"),
    syncStatus: text("sync_status")
      .notNull()
      .default(sql`'pending'`),
    version: int("version").notNull().default(1),
  },
  (t) => [
    index("category_budget_uuid").on(t.budget_uuid),
    index("category_uuid").on(t.uuid),
  ]
);
export type CategorySchemaType = typeof CategorySchema.$inferInsert;
