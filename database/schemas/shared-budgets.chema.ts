import {
  customType,
  index,
  int,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { BudgetSchema } from "./budget-schema";
import { UserSchema } from "./user-schema";

// // SHARED BUDGETS TABLE
export const SharedBudgetsSchema = sqliteTable(
  "shared_budgets",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    budget_uuid: text("budget_uuid")
      .notNull()
      .references(() => BudgetSchema.uuid, { onDelete: "cascade" }),
    user_uuid: text("user_uuid")
      .notNull()
      .references(() => UserSchema.uuid, { onDelete: "cascade" }),
    role: text("role").notNull(),
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
  (t) => [index("shared_budgets_budget_uuid").on(t.budget_uuid)]
);
