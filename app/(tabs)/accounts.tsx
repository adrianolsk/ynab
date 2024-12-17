import {
  Button,
  StyleSheet,
  ScrollView,
  SectionList,
  StatusBar,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "../../database/schemas/user-schema";
import { useEffect } from "react";
import { db } from "@/database/db";
import { eq, isNull } from "drizzle-orm";

type Account = {
  name: string;
  id: number;
  user_id: number;
  updated_at: string;
  account_type: string;
  balance: number | null;
  created_at: string;
};

const DATA = [
  {
    type: "card",
    title: undefined,
    data: ["All transactions"],
  },
  {
    type: "card",
    title: "Budget",
    data: ["Cash Account", "Savings", "WS Visa"],
  },
  {
    type: "card",
    title: "Loans",
    data: ["Mortgage", "Car Loan"],
  },
  {
    type: "card",
    title: "Tracking",
    data: ["TFSA", "RRSP"],
  },
];

export default function TabTwoScreen() {
  // const database = useSQLiteContext();
  // const db = drizzle(database, { schema });

  // const { data } = useLiveQuery(db.select().from(schema.users));
  const { data } = useLiveQuery(db.select().from(schema.accounts));

  const add = async () => {
    try {
      const response = db.insert(schema.accounts).values({
        name: "TFSA",
        account_type: "investment",
        user_id: 2,
        balance: 20000,
      });
      console.log("response", { response: (await response).lastInsertRowId });
    } catch (error) {
      console.log("error", { error });
    }
  };

  const deleteAll = async () => {
    try {
      const response = db.delete(schema.accounts).all();

      console.log("response", { response: await response });
    } catch (error) {
      console.log("error", { error });
    }
  };

  return (
    <ScrollView>
      <SectionList
        style={styles.section}
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title, type } }) => {
          return title ? <Text style={styles.header}>{title}</Text> : null;
        }}
        ListFooterComponent={() => {
          return <Button title="Add Account" onPress={() => {}} />;
        }}
      />
      {/* <View style={styles.container}>
        <Text style={styles.title}>Tab add</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <EditScreenInfo path="app/(tabs)/two.tsx" />
        <Button title="teste2" onPress={add}></Button>
        <Button title="teste2" onPress={deleteAll}></Button>
        <Text>{JSON.stringify(data, null, 2)}</Text>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  item: {
    // backgroundColor: "#f9c2ff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // marginVertical: 8,
  },
  header: {
    marginVertical: 8,
    // alignSelf: "flex-start",
    fontSize: 14,
    marginTop: 16,
    // borderWidth: 1,
    // backgroundColor: "#fff",
  },
  title: {
    fontSize: 14,
  },
});
