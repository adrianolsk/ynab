import {
  customType,
  index,
  int,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { AccountsSchema } from "./accounts-schema";
import { CategorySchema } from "./category-schema";

// TRANSACTIONS TABLE
export const TransactionsSchema = sqliteTable(
  "transactions",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    account_uuid: int("account_uuid")
      .notNull()
      .references(() => AccountsSchema.id, { onDelete: "cascade" }),
    category_id: int("category_id").references(() => CategorySchema.id, {
      onDelete: "set null",
    }),
    date: text("date").notNull(),
    amount: real("amount").notNull(),
    description: text("description"),
    cleared: int("cleared", { mode: "boolean" }).default(false),
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
  (t) => [index("transaction_account_uuid").on(t.account_uuid)]
);
