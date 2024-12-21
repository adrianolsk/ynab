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
import { AccountGroup, AccountType } from "@/types";
import { BudgetSchema } from "./budget-schema";

const accountGroupColumn = customType<{
  data: AccountGroup;
}>({
  dataType() {
    return "text";
  },
});

const accountTypeColumn = customType<{
  data: AccountType;
}>({
  dataType() {
    return "text";
  },
});

// ACCOUNTS TABLE
export const AccountsSchema = sqliteTable(
  "accounts",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull(),
    budget_uuid: int("budget_uuid")
      .notNull()
      .references(() => BudgetSchema.uuid, { onDelete: "cascade" }),
    name: text("name").notNull(),
    notes: text("notes"),
    account_group: accountGroupColumn("account_group")
      .notNull()
      .default("budget"),
    account_type: accountTypeColumn("account_type").notNull(),
    balance: real("balance").default(0.0),
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
    index("account_budget_uuid").on(t.budget_uuid),
    index("account_uuid").on(t.uuid),
  ]
);
export type AccountSchemaType = typeof AccountsSchema.$inferInsert;
