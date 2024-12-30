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
import { RefillStrategy, TargetType } from "@/types";

const targetTypeColumn = customType<{
  data: TargetType;
}>({
  dataType() {
    return "text";
  },
});

const refillStrategyColumn = customType<{
  data: RefillStrategy;
}>({
  dataType() {
    return "text";
  },
});

// TARGET TABLE
export const TargetSchema = sqliteTable(
  "target",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    category_uuid: text("category_uuid")
      .notNull()
      .references(() => CategorySchema.uuid, { onDelete: "cascade" }),

    target_amount: real("target_amount").notNull(),
    type: targetTypeColumn("type") // weekly, monthly, yearly, custom
      .notNull()
      .default(sql`'monthly'`),
    /**
     * { "every": "Saturday" }.
     * { "by_day": "5" }.
     * { "by_date": "2025-01-01" }.
     */

    frequency_details: text("frequency_details", { mode: "json" }).$type<
      { every: number } | { by_day: number } | { by_date: string } | null
    >(),

    // frequency_details: text("frequency_details"), // JSON field for recurrence (see details below)
    refill_strategy: refillStrategyColumn("refill_strategy") // 'set_aside', 'refill_up_to', 'balance_of'
      .notNull()
      .default(sql`'set_aside'`),
    due_date: text("due_date"), // Optional due date for yearly or custom target

    // { "interval": 3, "unit": "months" }
    // { "interval": 1, "unit": "years" }
    repeat_frequency: text("repeat_frequency", { mode: "json" }).$type<{
      interval: number;
      unit: "months" | "years";
    } | null>(),
    // repeat_frequency: text("repeat_frequency"), // JSON field for repeat settings
    repeat_enabled: int("repeat_enabled", { mode: "boolean" }).default(false),

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
    index("target_category_uuid").on(t.category_uuid),
    index("target_uuid").on(t.uuid),
  ]
);

export type TargetSchemaType = typeof TargetSchema.$inferInsert;
