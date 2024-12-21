import {
  Button,
  StyleSheet,
  ScrollView,
  SectionList,
  // StatusBar,
  Pressable,
  Platform,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View, ViewContent } from "@/components/Themed";
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

import { type AccountSchemaType } from "@/database/schemas/accounts-schema";
import { StatusBar } from "expo-status-bar";
import { formatCurrency } from "@/utils/financials";
import { CardButton } from "@/components/card-button";
import { AccountGroup } from "@/types";

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
  title?: AccountGroup;
  data: AccountSchemaType[];
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

    const arr = Object.entries(result).map(([key, value]) => ({
      title: value.title,
      data: value.data,
    }));

    // todo: add item at beginning of array
    arr.unshift({
      title: undefined,
      data: [
        {
          name: "All transactions",
          account_type: "checking",
          budget_uuid: "",
          uuid: "",
        },
      ],
    });
    return arr;
  }, [data]);

  const deleteAll = async () => {
    try {
      const response = db.delete(AccountsSchema).all();

      console.log("response", { response: await response });
    } catch (error) {
      console.log("error", { error });
    }
  };

  return (
    <>
      <SectionList
        style={styles.section}
        sections={accounts}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => (
          <Link href={`/accounts/edit/${item.id}`} asChild>
            <Pressable>
              <ViewContent style={styles.item}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.value,
                      (item.balance ?? 0) > 0 ? styles.positive : null,
                    ]}
                  >
                    {formatCurrency(item.balance)}
                  </Text>
                </View>
              </ViewContent>
            </Pressable>
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => {
          return title ? <Text style={styles.header}>{t(title)}</Text> : null;
        }}
        ListFooterComponent={() => {
          return (
            <View style={styles.footer}>
              <CardButton
                title="Add Account"
                onPress={() => {
                  router.push("/accounts/new");
                }}
              />
            </View>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
  },
  header: {
    marginVertical: 8,
    fontSize: 14,
    marginTop: 16,
    fontFamily: "NunitoSansSemiBold",
  },
  title: {
    flex: 1,
    fontSize: 14,
  },
  value: {
    fontFamily: "NunitoSansSemiBold",
  },
  positive: {
    color: "#4D9119",
  },
  footer: {
    marginTop: 32,
  },
});
