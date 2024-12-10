import { Button, StyleSheet, ScrollView } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "../../database/schemas/user-schema";
import { useEffect } from "react";
import { db } from "@/database/db";

export default function TabTwoScreen() {
  // const database = useSQLiteContext();
  // const db = drizzle(database, { schema });

  const { data } = useLiveQuery(db.select().from(schema.users));

  const add = async () => {
    try {
      const response = db.insert(schema.users).values({
        name: "Adriano",
      });
      console.log("response", { response: (await response).lastInsertRowId });
    } catch (error) {
      console.log("error", { error });
    }
  };

  const deleteAll = async () => {
    try {
      const response = db.update(schema.users).set({
        name: new Date().toISOString(),
      });
      console.log("response", { response: await response });
    } catch (error) {
      console.log("error", { error });
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Tab Two</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <EditScreenInfo path="app/(tabs)/two.tsx" />
        <Button title="teste2" onPress={add}></Button>
        <Button title="teste2" onPress={deleteAll}></Button>
        <Text>{JSON.stringify(data, null, 2)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
