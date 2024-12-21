import { db } from "@/database/db";
import { UserSchema } from "@/database/schemas/user-schema";
import { count } from "drizzle-orm";
import { useState, useEffect } from "react";
import { v4 as uuidV4 } from "uuid";

export const useDatabaseSeed = (isMigrationDone: boolean) => {
  const [ready, setReady] = useState(false);

  const seed = async () => {
    const [userCount] = await db.select({ count: count() }).from(UserSchema);

    console.log("🎾 here", { userCount });
    if (userCount.count === 0) {
      try {
        db.insert(UserSchema)
          .values({
            name: "Adriano",
            uuid: uuidV4(),

            syncStatus: "pending",
          })
          .catch((error) => {
            console.log("🍎 error", { error });
          })
          .then(() => {
            console.log("🍎 seed done @@@@@@");
          });
        console.log("🍎 seed done");
      } catch (error) {
        console.log("🍎 error", { error });
      }
    }

    // await db.insert(schema.UserSchema).values({
    //     name: "Adriano",
    // });
    setReady(true);
  };

  useEffect(() => {
    if (isMigrationDone) {
      seed();
    } else {
      console.log("🍎 useDatabaseSeed waiting migration");
    }

    // const database = useSQLiteContext();
    // const db = drizzle(database, { schema });

    // db.insert(schema.UserSchema).values({
    //     name: "Adriano",
    // });
  }, [isMigrationDone]);
};
