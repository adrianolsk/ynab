import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Platform, SectionList, StatusBar, StyleSheet } from "react-native";
import { Text, ViewContent } from "@/components/Themed";
import { db } from "@/database/db";
import {
  AccountSchemaType,
  AccountsSchema,
} from "@/database/schemas/accounts.schema";
import { AccountGroup } from "@/types";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Pressable } from "react-native-gesture-handler";

type AccountGroupItem = {
  title?: AccountGroup;
  data: AccountSchemaType[];
};
type MyObject = {
  [key in AccountGroup]: AccountGroupItem;
};

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type: "transaction";
  }>();

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

  const onSelect = useCallback(
    (item: AccountSchemaType) => {
      if (params.type === "transaction") {
        router.dismissTo({
          pathname: "/transaction/new",
          params: {
            accountUuid: item.uuid,
            accountName: item.name,
          },
        });
      }
    },
    [params.type, router]
  );

  return (
    <>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <ExpoStatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Stack.Screen
        options={{
          headerTitle: "Select an Account",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <SectionList
        stickySectionHeadersEnabled={false}
        style={styles.section}
        sections={accounts}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <Pressable
            // style={styles.item}
            onPress={() => onSelect(item)}
          >
            <ViewContent style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
            </ViewContent>
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => {
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
    // backgroundColor: "#ffffff",
    padding: 20,
    // borderBottomWidth: 1,
    marginBottom: 1,
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
