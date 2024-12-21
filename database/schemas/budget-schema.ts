import {
  customType,
  index,
  int,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { UserSchema } from "./user-schema";

// BUDGETS TABLE

export const BudgetSchema = sqliteTable(
  "budgets",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    user_uuid: text("user_uuid")
      .notNull()
      .references(() => UserSchema.uuid, { onDelete: "cascade" }),
    name: text("name").notNull(),
    start_date: text("start_date").notNull(),
    end_date: text("end_date"),
    currency: text("currency").notNull(),
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
  (t) => [index("budget_user_uuid").on(t.user_uuid)]
);
