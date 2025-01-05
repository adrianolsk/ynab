import { View, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";
import { db } from "@/database/db";
import { Text, ViewContent } from "@/components/Themed";
import { MonthlyAllocationsSchema } from "@/database/schemas/montly-allocation.schema";
import { Pressable } from "react-native-gesture-handler";
import { CategorySchemaType } from "@/database/schemas/category.schema";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";
import { ProgressBar } from "../progress-bar";
import { TargetSchema } from "@/database/schemas/target.schema";
import { BlinkingCaret } from "../blinking-caret";
import { FONT_FAMILIES } from "@/utils/constants";

interface CategoryCardProps {
  isSelected: boolean;
  onPress: (currentAllocatedAmount: number) => void;
  uuid: string;
  item: CategorySchemaType;
  isOpen: boolean;
  currentEditedAmount: string;
  currentMonth: string;
}
const CategoryCard = ({
  uuid,
  item,
  isOpen,
  isSelected,
  onPress,
  currentEditedAmount,
  currentMonth,
}: CategoryCardProps) => {
  const {
    data: [monthlyAllocation],
  } = useLiveQuery(
    db
      .select()
      .from(MonthlyAllocationsSchema)
      .where(
        and(
          eq(MonthlyAllocationsSchema.category_uuid, uuid),
          eq(MonthlyAllocationsSchema.month, currentMonth)
        )
      ),
    [uuid, currentMonth]
  );

  const selectedStyle = isSelected ? styles.selected : {};

  const rolloverAmount = monthlyAllocation?.rollover_amount ?? 0;
  const spentAmount = monthlyAllocation?.spent_amount ?? 0;
  const allocatedAmount = monthlyAllocation?.allocated_amount ?? 0;
  const availableAmount = allocatedAmount + rolloverAmount + spentAmount;
  const amountToShow = currentEditedAmount
    ? parseCurrencyToDecimal(currentEditedAmount)
    : allocatedAmount;

  const {
    data: [target],
  } = useLiveQuery(
    db.select().from(TargetSchema).where(eq(TargetSchema.category_uuid, uuid))
  );

  const availableAmountStyle = useMemo(() => {
    if (spentAmount < 0 && availableAmount < spentAmount * -1) {
      return styles.tagNegative;
    }
    if (availableAmount === 0 && target?.target_amount === 0) {
      return styles.availableGray;
    }
    if (availableAmount < target?.target_amount && target?.target_amount > 0) {
      return styles.availableYellow;
    }
    if (availableAmount >= target?.target_amount && target?.target_amount > 0) {
      return styles.availableGreen;
    }
    if (availableAmount > 0 && !target?.target_amount) {
      return styles.availableGreen;
    }

    return styles.availableGray;
  }, [availableAmount, spentAmount, target?.target_amount]);

  const spentLabel = useMemo(() => {
    if (spentAmount < 0 && availableAmount < spentAmount * -1) {
      const value = spentAmount * -1;
      return `Overspent: ${formatCurrency(value)} of ${formatCurrency(
        allocatedAmount
      )}`;
    }
    if (availableAmount === 0 && target?.target_amount === 0) {
      return "????";
    }
    if (availableAmount < target?.target_amount && target?.target_amount > 0) {
      const value = target?.target_amount - availableAmount;
      return `${formatCurrency(value)} more needed by the end of the month`;
    }
    if (availableAmount >= target?.target_amount && target?.target_amount > 0) {
      return "Funded";
    }
    if (availableAmount > 0 && !target?.target_amount) {
      return ""; // "Funded????";
    }

    return "";
  }, [allocatedAmount, availableAmount, spentAmount, target?.target_amount]);

  const selectedOpacity = { opacity: isSelected ? 0.7 : 1 };
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
        },
      ]}
      onPress={() => {
        onPress(monthlyAllocation?.allocated_amount ?? 0);
      }}
    >
      <ViewContent
        style={[
          {
            borderWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#ccc",
            padding: 12,
          },
          selectedStyle,
        ]}
      >
        <View style={[styles.item]}>
          <View style={{ flex: 2 }}>
            <Text style={[styles.title, selectedOpacity]}>{item.name}</Text>
          </View>
          <View>
            {isOpen && isSelected && (
              <Text style={[styles.title, styles.titleSelected]}>
                {formatCurrency(amountToShow)}
                <BlinkingCaret />
              </Text>
            )}
            {isOpen && !isSelected && (
              <Text style={styles.title}>{formatCurrency(amountToShow)}</Text>
            )}
          </View>
          <View style={{ width: 120, alignItems: "flex-end" }}>
            <View style={[styles.tag, availableAmountStyle, selectedOpacity]}>
              <Text style={styles.amountText}>
                {formatCurrency(availableAmount)}
              </Text>
            </View>
          </View>
        </View>
        <View style={[{ gap: 4, marginTop: 4 }, selectedOpacity]}>
          <ProgressBar
            target={target?.target_amount ?? 0}
            availableAmount={availableAmount}
            spentAmount={spentAmount}
            rolloverAmount={rolloverAmount}
            allocatedAmount={allocatedAmount}
          />
          {spentLabel && <Text style={styles.fundedOrSpent}>{spentLabel}</Text>}
        </View>
      </ViewContent>
    </Pressable>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selected: {
    backgroundColor: "#283351",
  },

  item: {
    flexDirection: "row",
  },
  header: {
    flexDirection: "row",
  },
  title: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.SemiBold,
  },
  amountText: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.Bold,
    color: "#111",
  },
  titleSelected: {
    fontFamily: FONT_FAMILIES.ExtraBold,
    fontSize: 14,
  },
  fundedOrSpent: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.Medium,
    color: "#aaa",
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
  availableYellow: {
    backgroundColor: "#FFD700",
  },
  availableGreen: {
    backgroundColor: "#4B9828",
  },
  availableGray: {
    backgroundColor: "#aaa",
  },
});
