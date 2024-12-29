import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  Platform,
  SectionList,
  StatusBar,
  StyleSheet,
  Touchable,
  View,
} from "react-native";
import { Text, TextInput, ViewContent } from "@/components/Themed";
import { db } from "@/database/db";
import {
  AccountSchemaType,
  AccountsSchema,
} from "@/database/schemas/accounts.schema";
import { CategorySchemaType } from "@/database/schemas/category.schema";
import { AccountGroup, AccountType } from "@/types";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import { PayeeSchema, PayeeSchemaType } from "@/database/schemas/payee.schema";
import { FontAwesome } from "@expo/vector-icons";
import { uuidV4 } from "@/utils/helpers";
import { getBudgetUuid } from "@/services/storage";

type PayeeItemGroup = {
  title?: string;
  data: PayeeSchemaType[];
};

type AccountItem = {
  name: string;
  type: AccountType;
};

interface SectionType {
  title: string;
  data: CategorySchemaType[];
}

type SectionItem = {
  title: string;
  data: AccountItem[];
};

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type: "transaction";
  }>();
  console.log("🍎 values", params.type);
  const [searchTerm, setSearchTerm] = useState("");
  const { data } = useLiveQuery(db.select().from(PayeeSchema));

  const accounts = useMemo(() => {
    const result = data?.reduce((acc, item) => {
      const firstChar = item.name.charAt(0);
      acc[firstChar] = acc[firstChar] || {
        title: firstChar,
        data: [],
      };
      acc[firstChar].data.push(item);
      return acc;
    }, {} as Record<string, PayeeItemGroup>);

    const arr = Object.entries(result).map(([key, value]) => ({
      title: value.title,
      data: value.data,
    }));

    return arr;
  }, [data]);

  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return accounts;

    return accounts.map((group) => {
      const filteredData = group.data.filter((item) => {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      return {
        ...group,
        data: filteredData,
      };
    });
  }, [accounts, searchTerm]);

  const onSelect = useCallback(
    (item: PayeeSchemaType | { uuid: string; name: string }) => {
      if (params.type === "transaction") {
        router.dismissTo({
          pathname: "/transaction/new",
          params: {
            payeeUuid: item.uuid,
            payeeName: item.name,
          },
        });
      }
    },
    [params.type, router]
  );

  const savePayee = async () => {
    const budgetUuid = (await getBudgetUuid()) ?? "";
    const [{ payee_uuid }] = await db
      .insert(PayeeSchema)
      .values({
        uuid: uuidV4(),
        budget_uuid: budgetUuid,
        name: searchTerm,
      })
      .returning({ payee_uuid: PayeeSchema.uuid });

    onSelect({
      uuid: payee_uuid,
      name: searchTerm,
    });
  };

  const deleteSearchTerm = () => {
    setSearchTerm("");
  };

  return (
    <>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <ExpoStatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Stack.Screen
        options={{
          headerTitle: "Select a Payee",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <ViewContent style={{ padding: 16, flexDirection: "row", height: 52 }}>
        <View style={{ flex: 1 }}>
          <TextInput
            placeholder="Search"
            autoComplete="off"
            onChangeText={setSearchTerm}
            value={searchTerm}
          />
        </View>
        {searchTerm && (
          <TouchableOpacity onPress={deleteSearchTerm}>
            <FontAwesome name="times-circle" size={20} color="#DDD" />
          </TouchableOpacity>
        )}
      </ViewContent>
      {searchTerm && (
        <TouchableOpacity onPress={savePayee}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 16,
              height: 48,
              padding: 16,
            }}
          >
            <FontAwesome name="plus" size={20} color="green" />
            <Text style={styles.addPayeeText}>Create "{searchTerm}" payee</Text>
          </View>
        </TouchableOpacity>
      )}
      <SectionList
        stickySectionHeadersEnabled={false}
        style={styles.section}
        sections={filteredAccounts}
        keyExtractor={(item, index) => item.uuid}
        renderItem={({ item }) => (
          <Pressable onPress={() => onSelect(item)}>
            <ViewContent style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
            </ViewContent>
          </Pressable>
        )}
        renderSectionHeader={({ section: { title, data } }) => {
          if (data.length === 0) return null;
          return title ? <Text style={styles.header}>{title}</Text> : null;
        }}
      />
    </>
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
    padding: 20,
    marginBottom: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    marginVertical: 8,
    fontSize: 14,
    marginTop: 16,
  },
  title: {
    fontSize: 14,
  },
  addPayeeText: {
    color: "#4B9828",
    fontFamily: "NunitoSansSemiBold",
  },
});
