import { SectionList, StyleSheet } from "react-native";
import { Text, View, ViewContent } from "@/components/Themed";
import { db } from "@/database/db";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AccountsSchema } from "../../database/schemas/accounts.schema";
import { type AccountSchemaType } from "@/database/schemas/accounts.schema";
import { CardButton } from "@/components/card-button";
import { AccountGroup } from "@/types";
import { formatCurrency } from "@/utils/financials";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FONT_FAMILIES } from "@/utils/constants";

type AccountGroupItem = {
  title?: AccountGroup;
  data: AccountSchemaType[];
};
type MyObject = {
  [key in AccountGroup]: AccountGroupItem;
};

export default function TabTwoScreen() {
  const { t } = useTranslation();

  const router = useRouter();

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

    const arr = Object.entries(result).map(([, value]) => ({
      title: value.title,
      data: value.data,
    }));

    return arr;
  }, [data]);

  const handlePress = (uuid: string) => () => {
    // router.push(`/accounts/edit/${uuid}`);
    router.push({
      pathname: "/transactions.screen",
      params: {
        accountUuid: uuid,
      },
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <ListItem
          title="All transactions"
          value={0}
          onPress={() => {
            router.push("/transactions.screen");
          }}
        />
      </View>
      <SectionList
        style={styles.section}
        sections={accounts}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            value={item.balance}
            onPress={handlePress(item.uuid)}
          />
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
    </View>
  );
}

interface ListItemProps {
  title: string;
  value?: number | null;
  onPress?: () => void;
}
const ListItem = ({ title, value, onPress }: ListItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <ViewContent style={styles.item}>
        <View style={{}}>
          <Text style={styles.title}>{title} </Text>
        </View>
        {!!value && (
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text
              style={[styles.value, (value ?? 0) > 0 ? styles.positive : null]}
            >
              {formatCurrency(value)}
            </Text>
          </View>
        )}
      </ViewContent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  item: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
  },
  header: {
    marginVertical: 8,
    fontSize: 14,
    marginTop: 16,
    fontFamily: FONT_FAMILIES.SemiBold,
  },
  title: {
    // flex: 1,
    fontSize: 14,
  },
  value: {
    fontFamily: FONT_FAMILIES.SemiBold,
  },
  positive: {
    color: "#4D9119",
  },
  footer: {
    marginTop: 32,
  },
});
