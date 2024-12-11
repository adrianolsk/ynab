import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

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
  (t) => [index("custom_name").on(t.id)]
);
