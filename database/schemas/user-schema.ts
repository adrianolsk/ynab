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
import { AccountsSchema } from "./accounts-schema";

// const customColumnAccountGroup = customType<{
//   data: AccountGroup;
// }>({
//   dataType() {
//     return "text";
//   },
// });

export const users = sqliteTable(
  "users",
  {
    id: int("id").primaryKey(),
    name: text("name").notNull(),
    updated_at: text("update_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    deleted_at: text("deleted_at"),
  },
  (t) => [index("user_id").on(t.id)]
);

// BUDGETS TABLE
export const budgets = sqliteTable(
  "budgets",
  {
    id: int("id").primaryKey(),
    user_id: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
  },
  (t) => [index("budget_user_id").on(t.user_id)]
);

// CATEGORIES TABLE
export const categories = sqliteTable(
  "categories",
  {
    id: int("id").primaryKey(),
    budget_id: int("budget_id")
      .notNull()
      .references(() => budgets.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    target_amount: real("target_amount").notNull(),
    created_at: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("category_budget_id").on(t.budget_id)]
);

// // ACCOUNTS TABLE
// export const accounts = sqliteTable(
//   "accounts",
//   {
//     id: int("id").primaryKey(),
//     user_id: int("user_id")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     name: text("name").notNull(),
//     account_group: customColumnAccountGroup("account_group")
//       .notNull()
//       .default("budget"),
//     account_type: text("account_type").notNull(),
//     balance: real("balance").default(0.0),
//     created_at: text("created_at")
//       .notNull()
//       .default(sql`(current_timestamp)`),
//     updated_at: text("updated_at")
//       .notNull()
//       .default(sql`(current_timestamp)`),
//   },
//   (t) => [index("account_user_id").on(t.user_id)]
// );
// export type AccountType = typeof AccountsSchema.$inferInsert;

// TRANSACTIONS TABLE
export const transactions = sqliteTable(
  "transactions",
  {
    id: int("id").primaryKey(),
    account_id: int("account_id")
      .notNull()
      .references(() => AccountsSchema.id, { onDelete: "cascade" }),
    category_id: int("category_id").references(() => categories.id, {
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
  },
  (t) => [index("transaction_account_id").on(t.account_id)]
);

// MONTHLY ALLOCATIONS TABLE
export const monthlyAllocations = sqliteTable(
  "monthly_allocations",
  {
    id: int("id").primaryKey(),
    budget_id: int("budget_id")
      .notNull()
      .references(() => budgets.id, { onDelete: "cascade" }),
    category_id: int("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    month: text("month").notNull(), // Format: YYYY-MM
    allocated_amount: real("allocated_amount").notNull(),
    created_at: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("monthly_allocations_budget_id").on(t.budget_id)]
);

// SCHEDULED TRANSACTIONS TABLE
export const scheduledTransactions = sqliteTable(
  "scheduled_transactions",
  {
    id: int("id").primaryKey(),
    account_id: int("account_id")
      .notNull()
      .references(() => AccountsSchema.id, { onDelete: "cascade" }),
    category_id: int("category_id").references(() => categories.id, {
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
  },
  (t) => [index("scheduled_transactions_account_id").on(t.account_id)]
);

// GOALS TABLE
export const goals = sqliteTable(
  "goals",
  {
    id: int("id").primaryKey(),
    category_id: int("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    target_amount: real("target_amount").notNull(),
    target_date: text("target_date").notNull(),
    created_at: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("goals_category_id").on(t.category_id)]
);

// SHARED BUDGETS TABLE
export const sharedBudgets = sqliteTable(
  "shared_budgets",
  {
    id: int("id").primaryKey(),
    budget_id: int("budget_id")
      .notNull()
      .references(() => budgets.id, { onDelete: "cascade" }),
    user_id: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    created_at: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("shared_budgets_budget_id").on(t.budget_id)]
);

// TAGS TABLE
export const tags = sqliteTable(
  "tags",
  {
    id: int("id").primaryKey(),
    user_id: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    created_at: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updated_at: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("tags_user_id").on(t.user_id)]
);

// TRANSACTION TAGS TABLE
export const transactionTags = sqliteTable(
  "transaction_tags",
  {
    transaction_id: int("transaction_id")
      .notNull()
      .references(() => transactions.id, { onDelete: "cascade" }),
    tag_id: int("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [index("transaction_tags_transaction_id").on(t.transaction_id)]
);
