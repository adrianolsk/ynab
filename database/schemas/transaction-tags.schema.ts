import {
  customType,
  index,
  int,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { TransactionsSchema } from "./transactions.schema";
import { TagsSchema } from "./tags.schema";

// TRANSACTION TAGS TABLE
export const transactionTags = sqliteTable(
  "transaction_tags",
  {
    transaction_uuid: int("transaction_uuid")
      .notNull()
      .references(() => TransactionsSchema.uuid, { onDelete: "cascade" }),
    tag_uuid: int("tag_uuid")
      .notNull()
      .references(() => TagsSchema.uuid, { onDelete: "cascade" }),
    deleted_at: text("deleted_at"),
    lastSyncedAt: text("last_synced_at"),
    syncStatus: text("sync_status")
      .notNull()
      .default(sql`'pending'`),
    version: int("version").notNull().default(1),
  },
  (t) => [index("transaction_tags_transaction_uuid").on(t.transaction_uuid)]
);
