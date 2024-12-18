import {
  customType,
  index,
  int,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { AccountGroup } from "../types";
import { users } from "./user-schema";

const customColumnAccountGroup = customType<{
  data: AccountGroup;
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
    user_id: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    account_group: customColumnAccountGroup("account_group")
      .notNull()
      .default("budget"),
    account_type: text("account_type").notNull(),
    balance: real("balance").default(0.0),
    created_at: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("account_user_id").on(t.user_id)]
);
export type AccountType = typeof accounts.$inferInsert;
