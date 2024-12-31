import ScreenView from "@/components/screen-view";
import { ViewContent } from "@/components/Themed";
import { db } from "@/database/db";
import {
  CategorySchemaType,
  CategorySchema,
} from "@/database/schemas/category.schema";
import { eq } from "drizzle-orm";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text } from "@/components/Themed";
import { StyleSheet, View } from "react-native";
import { formatCurrency } from "@/utils/financials";
import { CardButton } from "@/components/card-button";
import {
  MonthlyAllocationsSchema,
  MonthlyAllocationsSchemaType,
} from "@/database/schemas/montly-allocation.schema";

const CategoryDetail = () => {
  const [category, setCategory] = React.useState<CategorySchemaType | null>(
    null
  );
  const [allocation, setAllocation] =
    React.useState<MonthlyAllocationsSchemaType | null>(null);
  const params = useLocalSearchParams<{
    categoryUuid: string;
  }>();

  useEffect(() => {
    (async () => {
      if (params.categoryUuid) {
        const [categoryResult] = await db
          .select()
          .from(CategorySchema)
          .where(eq(CategorySchema.uuid, params.categoryUuid));

        const [allocationResult] = await db
          .select()
          .from(MonthlyAllocationsSchema)
          .where(
            eq(MonthlyAllocationsSchema.category_uuid, params.categoryUuid)
          );

        setCategory(categoryResult);
        setAllocation(allocationResult);
        console.log("🍎 allocationResult", allocationResult);
      }
    })();
  }, [params.categoryUuid]);

  return (
    <ScreenView>
      <Stack.Screen
        options={{
          headerTitle: category?.name ?? "Category Detail",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <View style={styles.block}>
        <Text style={styles.title}>Balance</Text>
        <ViewContent style={styles.container}>
          <LineItem title="From Nov" value={0} />
          <LineItem
            title="Assign for Dec"
            value={allocation?.allocated_amount ?? 0}
          />
          <LineItem
            title="Activity in Dec"
            value={allocation?.spent_amount ?? 0}
          />
          <LineItem
            hideBorder
            title="Available"
            value={
              (allocation?.allocated_amount ?? 0) -
              (allocation?.spent_amount ?? 0) * -1
            }
          />
        </ViewContent>
      </View>
      <View>
        <Text style={styles.title}>Target</Text>

        <ViewContent style={styles.targetContainer}>
          <Text style={styles.targetTitle}>
            How much do you need for {category?.name}?
          </Text>
          <Text>
            When you create a target, we'll let you know how much money to set
            aside to stay on track over time.
          </Text>
          <View style={{ marginTop: 32 }}>
            <CardButton title={"Create Target"} />
          </View>
        </ViewContent>
      </View>
    </ScreenView>
  );
};

interface LineItemProps {
  title: string;
  value: number;
  hideBorder?: boolean;
}
const LineItem = ({ title, value, hideBorder }: LineItemProps) => {
  const borderStyle = hideBorder ? {} : styles.lineItemBorder;

  return (
    <View style={[styles.lineItem, borderStyle]}>
      <Text style={styles.description}>{title}</Text>
      <Text style={styles.description}>{formatCurrency(value)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  lineItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f0f0f0",
  },
  block: {
    marginBottom: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  targetContainer: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 12,
    fontFamily: "NunitoSansMedium",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
  },
  targetTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "NunitoSansBold",
  },
});

export default CategoryDetail;
