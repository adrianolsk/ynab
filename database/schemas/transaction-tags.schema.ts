import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { TagsSchema } from "./tags.schema";
import { TransactionsSchema } from "./transactions.schema";

// TRANSACTION TAGS TABLE
export const transactionTags = sqliteTable(
  "transaction_tags",
  {
    transaction_uuid: text("transaction_uuid")
      .notNull()
      .references(() => TransactionsSchema.uuid, { onDelete: "cascade" }),
    tag_uuid: text("tag_uuid")
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
