import { Checkbox } from "@/components/checkbox/inde";
import { Text, TextInput, ViewContent } from "@/components/Themed";
import { db } from "@/database/db";
import {
  AccountSchemaType,
  AccountsSchema,
} from "@/database/schemas/accounts.schema";
import { CategorySchema } from "@/database/schemas/category.schema";
import { PayeeSchema } from "@/database/schemas/payee.schema";
import { TransactionsSchema } from "@/database/schemas/transactions.schema";
import { FONT_FAMILIES } from "@/utils/constants";
import { formatCurrency } from "@/utils/financials";
import { FontAwesome } from "@expo/vector-icons";
import { format } from "date-fns";
import { eq, sum } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Platform,
  SectionList,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";

interface TransactionItem {
  uuid: string;
  amount: number;
  date: string;
  payee: string;
  category: string;
  account: string;
  cleared: boolean;
}

type TrsancationItemGroup = {
  title?: string;
  data: TransactionItem[];
};

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accountUuid: string;
  }>();

  const [searchTerm, setSearchTerm] = useState("");
  const [account, setAccount] = useState<AccountSchemaType>();
  const [checkedItems, setCheckedItems] = useState<
    Record<string, TransactionItem>
  >({});

  useEffect(() => {
    if (!params.accountUuid) return;
    const accountUuid = params.accountUuid;
    db.select()
      .from(AccountsSchema)
      .where(eq(AccountsSchema.uuid, accountUuid))
      .then(([result]) => {
        setAccount(result);
      });
  }, [params.accountUuid]);

  const query = db
    .select({
      payee: PayeeSchema,
      category: CategorySchema,
      account: AccountsSchema,
      transaction: TransactionsSchema,
    })
    .from(TransactionsSchema)
    .innerJoin(PayeeSchema, eq(TransactionsSchema.payee_uuid, PayeeSchema.uuid))
    .innerJoin(
      CategorySchema,
      eq(TransactionsSchema.category_uuid, CategorySchema.uuid)
    )
    .innerJoin(
      AccountsSchema,
      eq(TransactionsSchema.account_uuid, AccountsSchema.uuid)
    );

  // Add conditional filtering
  if (params.accountUuid) {
    query.where(eq(TransactionsSchema.account_uuid, params.accountUuid));
  }

  const { data } = useLiveQuery(query);

  const accounts = useMemo(() => {
    const result = data?.reduce(
      (acc, item) => {
        const firstChar = item.transaction.date;
        acc[firstChar] = acc[firstChar] || {
          title: firstChar,
          data: [],
        };
        acc[firstChar].data.push({
          account: item.account.name,
          category: item.category.name,
          payee: item.payee.name,
          uuid: item.transaction.uuid,
          amount: item.transaction.amount,
          date: item.transaction.date,
          cleared: item.transaction.cleared ?? false,
        });
        return acc;
      },
      {} as Record<string, TrsancationItemGroup>
    );

    const arr = Object.entries(result).map(([, value]) => ({
      title: value.title,
      data: value.data,
    }));

    return arr;
  }, [data]);

  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return accounts;

    return accounts.map((group) => {
      const filteredData = group.data.filter((item) => {
        return item.payee.toLowerCase().includes(searchTerm.toLowerCase());
      });
      return {
        ...group,
        data: filteredData,
      };
    });
  }, [accounts, searchTerm]);

  const onSelect = useCallback(
    (item: TransactionItem | { uuid: string; name: string }) => {
      router.push({
        pathname: "/transaction/new",
        params: {
          uuid: item.uuid,
          // payeeName: item.name,
        },
      });
    },
    [router]
  );

  return (
    <>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <ExpoStatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Stack.Screen
        options={{
          headerTitle: account?.name ?? "Transactions",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      {!!account && <AccountDetails account={account} />}
      <ViewContent style={{ padding: 16, flexDirection: "row", height: 52 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Search"
            autoComplete="off"
            onChangeText={setSearchTerm}
            value={searchTerm}
          />
        </View>
      </ViewContent>

      <SectionList
        stickySectionHeadersEnabled={false}
        sections={filteredAccounts}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <TransactionItemRow
            item={item}
            isChecked={!!checkedItems[item.uuid]}
            onPress={() => onSelect(item)}
            onCheck={() => {
              setCheckedItems((prev) => {
                if (prev[item.uuid]) {
                  delete prev[item.uuid];
                } else {
                  prev[item.uuid] = item;
                }
                return { ...prev };
              });
            }}
          />
        )}
        renderSectionHeader={({ section: { title, data } }) => {
          if (data.length === 0) return null;
          return title ? (
            <Text style={styles.header}>{format(title, "dd/MM/yyyy")}</Text>
          ) : null;
        }}
      />
    </>
  );
}

interface TransactionItemRowProps {
  item: TransactionItem;
  isChecked?: boolean;
  onPress?: () => void;
  onCheck?: () => void;
}
const TransactionItemRow = ({
  item,
  isChecked,
  onPress,
  onCheck,
}: TransactionItemRowProps) => {
  return (
    <ViewContent style={styles.item}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Checkbox value={isChecked} onValueChange={onCheck} />
      </View>
      <Pressable onPress={onPress} style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.payeeName}>{item.payee}</Text>
            <Text style={styles.categoryName}>{item.category}</Text>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
            <Text style={styles.accountName}>{item.account}</Text>
          </View>
          <View>
            <FontAwesome
              name={item.cleared ? "check-circle" : "times-circle"}
              color={item.cleared ? "#4D9119" : "#C72C1E"}
            />
          </View>
        </View>
      </Pressable>
    </ViewContent>
  );
};

const AccountDetails = ({ account }: { account: AccountSchemaType }) => {
  const [clearedAmount, setClearedAmount] = useState(0);
  const [unclearedAmount, setUnclearedAmount] = useState(0);

  useEffect(() => {
    db.select({
      cleared: TransactionsSchema.cleared,
      total: sum(TransactionsSchema.amount).mapWith(Number),
    })
      .from(TransactionsSchema)
      .where(eq(TransactionsSchema.account_uuid, account.uuid))
      .groupBy(TransactionsSchema.cleared)

      .then((result) => {
        for (const { cleared, total } of result) {
          if (cleared) {
            setClearedAmount(total);
          } else {
            setUnclearedAmount(total);
          }
        }
      })
      .catch((error) => {
        console.log("🍎 error 1", { error });
      });
  }, [account]);
  return (
    <View style={styles.accountDetails}>
      <View style={{ flex: 1 }}>
        <Text>Working balance</Text>
        <Text>{formatCurrency(account?.balance ?? 0)}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text>Cleared</Text>
        <Text>Uncleared</Text>
      </View>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text> {formatCurrency(clearedAmount)}</Text>
        <Text> {formatCurrency(unclearedAmount)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  accountDetails: {
    padding: 16,
    flexDirection: "row",
  },
  item: {
    padding: 16,
    marginBottom: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    gap: 8,
  },
  header: {
    marginVertical: 16,
    fontSize: 14,
    // marginTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 14,
  },
  payeeName: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SemiBold,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.Light,
  },
  accountName: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.Light,
  },
  amount: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.Bold,
  },
  addPayeeText: {
    color: "#4B9828",
    fontFamily: FONT_FAMILIES.SemiBold,
  },
});
