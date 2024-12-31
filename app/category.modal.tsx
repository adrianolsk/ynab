import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Platform, SectionList, StatusBar, StyleSheet } from "react-native";

import { Text, ViewContent } from "@/components/Themed";
import { db } from "@/database/db";
import {
  CategoryGroupSchema,
  CategoryGroupSchemaType,
} from "@/database/schemas/category-group.schema";
import {
  CategorySchema,
  CategorySchemaType,
} from "@/database/schemas/category.schema";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { Pressable } from "react-native-gesture-handler";
import React from "react";

interface SectionType {
  title: string;
  data: CategorySchemaType[];
}

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    type: "transaction";
  }>();

  const { data: liveData } = useLiveQuery(
    db
      .select({
        category: CategorySchema,
        group: CategoryGroupSchema,
      })
      .from(CategorySchema)
      .innerJoin(
        CategoryGroupSchema,
        eq(CategoryGroupSchema.uuid, CategorySchema.category_group_uuid)
      )
  );
  const sectionData = useMemo((): SectionType[] => {
    if (!liveData) return [];

    // Use a Map to group categories by their group ID
    const groupMap = new Map<
      number,
      { group: CategoryGroupSchemaType; categories: CategorySchemaType[] }
    >();

    for (const { group, category } of liveData) {
      if (!groupMap.has(group.id)) {
        groupMap.set(group.id, { group, categories: [] });
      }

      if (category) {
        groupMap.get(group.id)!.categories.push(category); // `!` is safe due to the previous check
      }
    }

    // Convert the Map to an array of sections
    return Array.from(groupMap.values()).map(({ group, categories }) => ({
      title: group.name,
      data: categories,
    }));
  }, [liveData]);

  const onSelect = useCallback(
    (item: CategorySchemaType) => {
      if (params.type === "transaction") {
        router.dismissTo({
          pathname: "/transaction/new",
          params: {
            categoryUuid: item.uuid,
            categoryName: item.name,
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
          headerTitle: "Choose a Category",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <SectionList
        stickySectionHeadersEnabled={false}
        style={styles.section}
        sections={sectionData}
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
