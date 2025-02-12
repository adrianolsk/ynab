import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { BudgetSchema } from "./budget.schema";
import { CategorySchema } from "./category.schema";

// PAYEES TABLE
export const PayeeSchema = sqliteTable(
  "payees",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    budget_uuid: text("budget_uuid")
      .notNull()
      .references(() => BudgetSchema.uuid, { onDelete: "cascade" }),
    last_category_uuid: text("last_category_uuid").references(
      () => CategorySchema.uuid
    ),
    name: text("name").notNull(),
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
    index("payee_budget_uuid").on(t.budget_uuid),
    index("payee_uuid").on(t.uuid),
  ]
);
export type PayeeSchemaType = typeof PayeeSchema.$inferInsert;
