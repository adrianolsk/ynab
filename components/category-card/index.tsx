import { View, StyleSheet, StatusBar } from "react-native";
import React, { useMemo } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { Text, ViewContent } from "@/components/Themed";
import { MonthlyAllocationsSchema } from "@/database/schemas/montly-allocation.schema";
import { Pressable } from "react-native-gesture-handler";
import { CategorySchemaType } from "@/database/schemas/category.schema";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";

interface CategoryCardProps {
  isSelected: boolean;
  onPress: (currentAllocatedAmount: number) => void;
  uuid: string;
  item: CategorySchemaType;
  isOpen: boolean;
  currentEditedAmount: string;
}
const CategoryCard = ({
  uuid,
  item,
  isOpen,
  isSelected,
  onPress,
  currentEditedAmount,
}: CategoryCardProps) => {
  const {
    data: [monthlyAllocation],
  } = useLiveQuery(
    db
      .select()
      .from(MonthlyAllocationsSchema)
      .where(eq(MonthlyAllocationsSchema.category_uuid, uuid))
  );

  const selectedStyle = isSelected ? styles.selected : {};

  const rolloverAmount = monthlyAllocation?.rollover_amount ?? 0;
  const spentAmount = monthlyAllocation?.spent_amount ?? 0;
  const allocatedAmount = monthlyAllocation?.allocated_amount ?? 0;
  const availableAmount = allocatedAmount + rolloverAmount - spentAmount;
  const amountToShow = currentEditedAmount
    ? parseCurrencyToDecimal(currentEditedAmount)
    : allocatedAmount;
  if (isSelected) {
    console.log("AQUI", { currentEditedAmount, amountToShow, allocatedAmount });
  }

  const tagStyle = useMemo(() => {
    if (availableAmount > 0) {
      return styles.tagPositive;
    } else if (availableAmount === 0) {
      return styles.tagGray;
    } else {
      return styles.tagNegative;
    }
  }, [availableAmount]);

  return (
    <Pressable
      onPress={() => {
        onPress(monthlyAllocation?.allocated_amount ?? 0);
      }}
    >
      <ViewContent style={[styles.item, selectedStyle]}>
        {/* <Text>{JSON.stringify(monthlyAllocation, null, 2)}</Text> */}
        <View style={{ flex: 2 }}>
          <Text style={styles.title}>{item.name}</Text>
        </View>
        <View>
          {/* {isOpen && (
            <Text style={styles.title}>
              {formatCurrency(monthlyAllocation?.allocated_amount ?? 0)}
            </Text>
          )} */}

          {isOpen && isSelected && (
            <Text style={[styles.title, styles.titleSelected]}>
              {formatCurrency(amountToShow)}
            </Text>
          )}
          {isOpen && !isSelected && (
            <Text style={styles.title}>{formatCurrency(amountToShow)}</Text>
          )}
        </View>
        <View style={{ width: 120, alignItems: "flex-end" }}>
          <View style={[styles.tag, tagStyle]}>
            <Text style={styles.title}>{formatCurrency(availableAmount)}</Text>
          </View>
        </View>
      </ViewContent>
      <View>
        {/* <Text>{JSON.stringify(monthlyAllocation, null, 2)}</Text> */}
      </View>
    </Pressable>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  selected: {
    backgroundColor: "#005583",
  },
  section: {
    padding: 16,
    // marginBottom: 300,
  },
  item: {
    flexDirection: "row",
    padding: 20,
    marginBottom: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 12,
    fontFamily: "NunitoSansMedium",
  },
  titleSelected: {
    // fontSize: 13,
    fontFamily: "NunitoSansBold",
    // color: "#4D9119",
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagPositive: {
    backgroundColor: "#4D9119",
  },
  tagNegative: {
    backgroundColor: "#C72C1E",
  },
  tagWarning: {
    backgroundColor: "yellow",
  },
  tagGray: {
    backgroundColor: "#aaa",
  },
});
