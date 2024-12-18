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
import { AccountsSchema } from "../../database/schemas/accounts-schema";
import { useEffect, useMemo } from "react";
import { db } from "@/database/db";
import { eq, isNull } from "drizzle-orm";
import {
  Link,
  useNavigation,
  useNavigationContainerRef,
  useRootNavigation,
  useRouter,
} from "expo-router";
import { routeToScreen } from "expo-router/build/useScreens";
import { useTranslation } from "react-i18next";
import { AccountGroup } from "@/database/types";
import { type AccountType } from "@/database/schemas/accounts-schema";

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
    title: undefined,
    data: ["All transactions"],
  },
  {
    title: "Budget",
    data: ["Cash Account", "Savings", "WS Visa"],
  },
  {
    title: "Loans",
    data: ["Mortgage", "Car Loan"],
  },
  {
    title: "Tracking",
    data: ["TFSA", "RRSP"],
  },
];

type RootStackParamList = {
  details: { id: number; name: string };
};

type AccountGroupItem = {
  title: AccountGroup;
  data: AccountType[];
};
type MyObject = {
  [key in AccountGroup]: AccountGroupItem;
};

export default function TabTwoScreen() {
  const { t } = useTranslation();

  // const database = useSQLiteContext();
  // const db = drizzle(database, { schema });
  const router = useRouter();
  // const { data } = useLiveQuery(db.select().from(schema.users));
  const { data } = useLiveQuery(db.select().from(AccountsSchema));

  const accounts = useMemo(() => {
    const result = data?.reduce((acc, item) => {
      acc[item.account_group] = acc[item.account_group] || {
        title: item.account_group,
        data: [],
      };
      acc[item.account_group].data.push(item);
      return acc;
    }, {} as MyObject);

    return Object.entries(result).map(([key, value]) => ({
      title: value.title,
      data: value.data,
    }));
  }, [data]);
  console.log("data le accounts", JSON.stringify({ accounts }, null, 2));

  const deleteAll = async () => {
    try {
      const response = db.delete(schema.accounts).all();

      console.log("response", { response: await response });
    } catch (error) {
      console.log("error", { error });
    }
  };

  return (
    <SectionList
      style={styles.section}
      sections={accounts}
      keyExtractor={(item, index) => item.name + index}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>
            {item.name} -{item.balance?.toFixed(2)}
          </Text>
        </View>
      )}
      renderSectionHeader={({ section: { title } }) => {
        return title ? <Text style={styles.header}>{t(title)}</Text> : null;
      }}
      ListFooterComponent={() => {
        return (
          // <Link href="/accounts/new">Add Account</Link>
          <View style={styles.footer}>
            <Button
              title="Add Account"
              onPress={() => {
                router.push("/accounts/new");
              }}
            />
            {/* <Button
              title={t("budget")}
              onPress={() => {
                deleteAll();
              }}
            /> */}
          </View>
        );
      }}
    />
  );
}

/* <View style={styles.container}>
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
      </View> */

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
  footer: {
    marginTop: 32,
  },
});
