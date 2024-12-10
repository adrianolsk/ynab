import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const DATABASE_NAME = "ynab.db";

const expoDb = openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true,
});
export const db = drizzle(expoDb);
