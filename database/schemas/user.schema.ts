import {
  customType,
  index,
  int,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

//USERS TABLE
export const UserSchema = sqliteTable(
  "users",
  {
    id: int("id").primaryKey(),
    uuid: text("uuid").notNull().unique(),
    name: text("name").notNull(),
    createdAt: text("update_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    updated_at: text("update_at")
      .notNull()
      .default(sql`(current_timestamp)`),
    deleted_at: text("deleted_at"),
    lastSyncedAt: text("last_synced_at"),
    syncStatus: text("sync_status")
      .notNull()
      .default(sql`'pending'`),
    version: int("version").notNull().default(1),
  },
  (t) => [index("user_uuid").on(t.uuid)]
);
