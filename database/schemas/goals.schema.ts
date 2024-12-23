import {
  customType,
  index,
  int,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

import { CategorySchema } from "./category.schema";
// GOALS TABLE
export const GoalsSchema = sqliteTable(
  "goals",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    category_uuid: text("category_uuid")
      .notNull()
      .references(() => CategorySchema.uuid, { onDelete: "cascade" }),

    target_amount: real("target_amount").notNull(),
    target_date: text("target_date").notNull(),
    current_amount: real("current_amount").default(0), // Current progress
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
    index("goals_category_uuid").on(t.category_uuid),
    index("goals_uuid").on(t.uuid),
  ]
);
