
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: int("id").primaryKey(),
    name: text("name").notNull()
  },
  (t) => [index("custom_name").on(t.id)]
);
