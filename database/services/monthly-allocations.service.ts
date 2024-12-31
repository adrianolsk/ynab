import { uuidV4 } from "@/utils/helpers";
import { db } from "../db";

import { MonthlyAllocationsSchema } from "../schemas/montly-allocation.schema";
import { and, eq } from "drizzle-orm";

interface GetMonthlyAllocationsParams {
  budget_uuid: string;
  month: string;
  categoryUuid: string;
}
const getMonthlyAllocation = async ({
  budget_uuid,
  month,
  categoryUuid,
}: GetMonthlyAllocationsParams) => {
  const [result] = await db
    .select()
    .from(MonthlyAllocationsSchema)
    .where(
      and(
        eq(MonthlyAllocationsSchema.category_uuid, categoryUuid),
        eq(MonthlyAllocationsSchema.budget_uuid, budget_uuid),
        eq(MonthlyAllocationsSchema.month, month)
      )
    );

  return result;
};

interface UpdateReadyToAssignParams {
  budget_uuid: string;
  month: string;
  value: number;
  categoryUuid: string;
}
export const updateSpentAmount = async ({
  budget_uuid,
  month,
  value,
  categoryUuid,
}: UpdateReadyToAssignParams) => {
  const current = await getMonthlyAllocation({
    budget_uuid,
    month,
    categoryUuid,
  });

  if (!current) {
    insertAllocation({
      budget_uuid,
      month,
      value,
      categoryUuid,
    });
  } else {
    // todo: calculate spent_amount using all transactions of that category
    const newSpentAmount = current.spent_amount + value;

    await db
      .update(MonthlyAllocationsSchema)
      .set({
        spent_amount: newSpentAmount,
      })
      .where(eq(MonthlyAllocationsSchema.id, current.id));
  }
};

interface InsertReadyToAssignParams {
  budget_uuid: string;
  month: string;
  value: number;
  categoryUuid: string;
}
export const insertAllocation = async ({
  budget_uuid,
  month,
  value,
  categoryUuid,
}: InsertReadyToAssignParams) => {
  await db
    .insert(MonthlyAllocationsSchema)
    .values({
      uuid: uuidV4(),
      budget_uuid,
      category_uuid: categoryUuid,
      month,
      allocated_amount: 0,
      spent_amount: value,
    })
    .onConflictDoUpdate({
      target: [
        MonthlyAllocationsSchema.category_uuid,
        MonthlyAllocationsSchema.month,
        MonthlyAllocationsSchema.budget_uuid,
      ], // Columns that define the conflict
      set: { allocated_amount: value }, // What to update
    });
};
