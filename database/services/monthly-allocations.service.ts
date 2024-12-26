import { uuidV4 } from "@/utils/helpers";
import { db } from "../db";
import { CategorySchema } from "../schemas/category.schema";
import { MonthlyAllocationsSchema } from "../schemas/montly-allocation.schema";
import { and, eq } from "drizzle-orm";

interface GetMonthlyAllocationsParams {
  budget_uuid: string;
  month: string;
}
export const getMonthlyAllocation = async ({
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

  console.log("🦧 result", { result: result });
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
    const currentAllocatedAmount = current.allocated_amount;
    const newAllocatedAmount = current.allocated_amount + value;
    console.log("");
    console.log("🅰 values to assing", {
      currentAllocatedAmount,
      value,
      newAllocatedAmount,
    });
    console.log("");
    const result = await db
      .update(MonthlyAllocationsSchema)
      .set({
        allocated_amount: newAllocatedAmount,
      })
      .where(eq(MonthlyAllocationsSchema.id, current.id));

    console.log("updated", result);
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
  const result = await db
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
  console.log("inserted", result.lastInsertRowId);
};
