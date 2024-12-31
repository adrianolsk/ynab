import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { BudgetSchema } from "./budget.schema";

// CATEGORIES TABLE
export const CategoryGroupSchema = sqliteTable(
  "category_group",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    budget_uuid: text("budget_uuid")
      .notNull()
      .references(() => BudgetSchema.uuid, { onDelete: "cascade" }),
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
    index("category_group_budget_uuid").on(t.budget_uuid),
    index("category_group_uuid").on(t.uuid),
  ]
);

export type CategoryGroupSchemaType = typeof CategoryGroupSchema.$inferInsert;
