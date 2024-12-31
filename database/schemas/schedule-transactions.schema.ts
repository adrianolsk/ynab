import { sql } from "drizzle-orm";
import { index, int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { AccountsSchema } from "./accounts.schema";
import { CategorySchema } from "./category.schema";

// SCHEDULED TRANSACTIONS TABLE
export const ScheduledTransactionsSchema = sqliteTable(
  "scheduled_transactions",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    account_uuid: text("account_uuid")
      .notNull()
      .references(() => AccountsSchema.uuid, { onDelete: "cascade" }),
    category_uuid: text("category_uuid").references(() => CategorySchema.uuid, {
      onDelete: "set null",
    }),
    amount: real("amount").notNull(),
    frequency: text("frequency").notNull(),
    next_due_date: text("next_due_date").notNull(),
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
  (t) => [index("scheduled_transactions_account_uuid").on(t.account_uuid)]
);
