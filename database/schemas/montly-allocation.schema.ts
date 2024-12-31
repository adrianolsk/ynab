import { sql } from "drizzle-orm";
import {
  index,
  int,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { BudgetSchema } from "./budget.schema";
import { CategorySchema } from "./category.schema";

// MONTHLY ALLOCATIONS TABLE
export const MonthlyAllocationsSchema = sqliteTable(
  "monthly_allocations",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    budget_uuid: text("budget_uuid")
      .notNull()
      .references(() => BudgetSchema.uuid, { onDelete: "cascade" }),
    category_uuid: text("category_uuid")
      // .notNull()
      .references(() => CategorySchema.uuid, { onDelete: "cascade" }),
    month: text("month").notNull(), // Format: YYYY-MM
    allocated_amount: real("allocated_amount").notNull().default(0),
    rollover_amount: real("rollover_amount").notNull().default(0),
    spent_amount: real("spent_amount").notNull().default(0),
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
    index("monthly_allocations_budget_uuid").on(t.budget_uuid),
    index("monthly_allocations_uuid").on(t.uuid),
    unique("unique_category_month_budget").on(
      t.category_uuid,
      t.month,
      t.budget_uuid
    ),
  ]
);
