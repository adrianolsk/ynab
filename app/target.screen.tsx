import ScreenView from "@/components/screen-view";
import { ViewContent } from "@/components/Themed";
import { db } from "@/database/db";
import {
  CategorySchemaType,
  CategorySchema,
} from "@/database/schemas/category.schema";
import { and, eq } from "drizzle-orm";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Text } from "@/components/Themed";
import { Pressable, StyleSheet, View } from "react-native";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";
import { CardButton } from "@/components/card-button";
import {
  MonthlyAllocationsSchema,
  MonthlyAllocationsSchemaType,
} from "@/database/schemas/montly-allocation.schema";
import { formatWithLocale } from "@/utils/dates";
import { useTranslation } from "react-i18next";
import { addMonths, parse, set } from "date-fns";
import { TextField } from "@/components/text-field";
import { Separator } from "@/components/separator";

type FrequencyType = "weekly" | "monthly" | "yearly" | "custom";
const frquencyList: FrequencyType[] = ["weekly", "monthly", "yearly", "custom"];

const CategoryDetail = () => {
  const router = useRouter();
  const [targetAmount, setTargetAmount] = React.useState("0");
  const [selectedFrequency, setSelectedFrequency] =
    React.useState<FrequencyType>("monthly");

  const { t } = useTranslation();
  const [category, setCategory] = React.useState<CategorySchemaType | null>(
    null
  );
  const [allocation, setAllocation] =
    React.useState<MonthlyAllocationsSchemaType | null>(null);
  const params = useLocalSearchParams<{
    categoryUuid: string;
    month: string;
    amount: string;
  }>();

  useEffect(() => {
    if (params.amount) {
      setTargetAmount(params.amount);
    }
  }, [params.amount]);

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
            and(
              eq(MonthlyAllocationsSchema.category_uuid, params.categoryUuid)
              // eq(MonthlyAllocationsSchema.month, params.month)
            )
          );

        setCategory(categoryResult);
        setAllocation(allocationResult);
      }
    })();
  }, [params.categoryUuid, params.month]);

  return (
    <ScreenView>
      <Stack.Screen
        options={{
          headerTitle: category?.name ?? "Category Detail",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <ViewContent
        style={[styles.block, { flex: 1, padding: 16, borderRadius: 16 }]}
      >
        <View
          style={[
            {
              borderWidth: StyleSheet.hairlineWidth,
              gap: StyleSheet.hairlineWidth,
              borderColor: "#f0f0f0",
              height: 48,
              backgroundColor: "#f0f0f0",
              flex: 1,
              borderRadius: 16,
              overflow: "hidden",
              flexDirection: "row",
            },
          ]}
        >
          {frquencyList.map((item) => (
            <Pressable
              key={item}
              style={({ pressed }) => [
                styles.frequencyButton,
                selectedFrequency === item
                  ? styles.frequencyButtonSelected
                  : {},
                pressed ? styles.frequencyButtonSelected : {},
              ]}
              onPress={() => {
                setSelectedFrequency(item);
                console.log("Edit category");
              }}
            >
              <Text>{t(`screen.targetDetail.frequency.${item}`)}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ marginTop: 16 }}>
          <TextField
            placeholder="I need"
            style={{}}
            value={formatCurrency(parseCurrencyToDecimal(targetAmount))}
            onPress={() =>
              router.push({
                pathname: "/amount.modal",
                params: {
                  id: 1,
                  amount: targetAmount,
                },
              })
            }
            icon="money"
            iconColor="#233883"
          />
          <Separator />
          <TextField
            placeholder="By"
            style={{}}
            value={formatWithLocale(new Date(), "MMMM yyyy")}
            onPress={() =>
              router.push({
                pathname: "/payee.modal",
                params: {
                  id: 1,
                  type: "transaction",
                },
              })
            }
            icon="calendar"
            iconColor="#233883"
          />
          <Separator />
          <TextField
            placeholder="Next month I want to"
            style={{}}
            value={formatWithLocale(new Date(), "MMMM yyyy")}
            onPress={() =>
              router.push({
                pathname: "/payee.modal",
                params: {
                  id: 1,
                  type: "transaction",
                },
              })
            }
            icon="refresh"
            iconColor="#233883"
          />
        </View>
      </ViewContent>
      {/* <WarningBlock /> */}

      <View style={{ gap: 8, marginTop: 16 }}>
        <CardButton
          title={"Save Target"}
          onPress={() => {
            console.log("Edit category");
          }}
        />
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  frequencyButtonSelected: {
    backgroundColor: "#233883",
  },
  frequencyButton: {
    flex: 1,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0C1722",
  },
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
