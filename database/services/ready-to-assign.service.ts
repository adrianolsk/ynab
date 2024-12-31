import { uuidV4 } from "@/utils/helpers";
import { db } from "../db";
import { MonthlyAllocationsSchema } from "../schemas/montly-allocation.schema";
import { and, eq } from "drizzle-orm";

interface GetMonthlyAllocationsParams {
  budget_uuid: string;
  month: string;
}
const getMonthlyAllocation = async ({
  budget_uuid,
  month,
}: GetMonthlyAllocationsParams) => {
  const [result] = await db
    .select()
    .from(MonthlyAllocationsSchema)
    .where(
      and(
        eq(MonthlyAllocationsSchema.category_uuid, "ready_to_assign"),
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
}
export const updateReadyToAssign = async ({
  budget_uuid,
  month,
  value,
}: UpdateReadyToAssignParams) => {
  const current = await getMonthlyAllocation({ budget_uuid, month });

  if (!current) {
    insertReadyToAssign({
      budget_uuid,
      month,
      value,
    });
  } else {
    const newAllocatedAmount = current.allocated_amount + value;

    await db
      .update(MonthlyAllocationsSchema)
      .set({
        allocated_amount: newAllocatedAmount,
      })
      .where(eq(MonthlyAllocationsSchema.id, current.id));
  }
};

interface InsertReadyToAssignParams {
  budget_uuid: string;
  month: string;
  value: number;
}
export const insertReadyToAssign = async ({
  budget_uuid,
  month,
  value,
}: InsertReadyToAssignParams) => {
  await db
    .insert(MonthlyAllocationsSchema)
    .values({
      uuid: uuidV4(),
      budget_uuid,
      category_uuid: "ready_to_assign",
      month,
      allocated_amount: value,
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
