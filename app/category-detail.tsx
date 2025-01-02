import ScreenView from "@/components/screen-view";
import { ViewContent } from "@/components/Themed";
import { db } from "@/database/db";
import {
  CategorySchemaType,
  CategorySchema,
} from "@/database/schemas/category.schema";
import { and, eq } from "drizzle-orm";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { Text } from "@/components/Themed";
import { StyleSheet, View } from "react-native";
import { formatCurrency } from "@/utils/financials";
import { CardButton } from "@/components/card-button";
import {
  MonthlyAllocationsSchema,
  MonthlyAllocationsSchemaType,
} from "@/database/schemas/montly-allocation.schema";
import { formatWithLocale } from "@/utils/dates";
import { useTranslation } from "react-i18next";
import { addMonths, parse } from "date-fns";

const CategoryDetail = () => {
  const { t } = useTranslation();
  const [category, setCategory] = React.useState<CategorySchemaType | null>(
    null
  );
  const [allocation, setAllocation] =
    React.useState<MonthlyAllocationsSchemaType | null>(null);
  const params = useLocalSearchParams<{
    categoryUuid: string;
    month: string;
  }>();

  const monthData = useMemo(() => {
    const parsedDate = parse(params.month, "yyyy-MM", new Date());
    return {
      previousMonth: addMonths(parsedDate, -1),
      currentMonth: parsedDate,
    };
  }, [params.month]);

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
              eq(MonthlyAllocationsSchema.category_uuid, params.categoryUuid),
              eq(MonthlyAllocationsSchema.month, params.month)
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
      <View style={styles.block}>
        <Text style={styles.title}>{t("screen.categoryDetail.balance")}</Text>
        <ViewContent style={styles.container}>
          <LineItem
            title={t("screen.categoryDetail.from", {
              month: formatWithLocale(monthData.previousMonth, "MMM"),
            })}
            value={0}
          />
          <LineItem
            title={t("screen.categoryDetail.assigned", {
              month: formatWithLocale(params.month, "MMM"),
            })}
            value={allocation?.allocated_amount ?? 0}
          />
          <LineItem
            title={t("screen.categoryDetail.activity", {
              month: formatWithLocale(params.month, "MMM"),
            })}
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
      {/* <WarningBlock /> */}
      <View>
        <Text style={styles.title}>{t("screen.categoryDetail.target")}</Text>

        <ViewContent style={styles.targetContainer}>
          <Text style={styles.targetTitle}>
            {t("screen.categoryDetail.targetTitle", {
              categoryName: category?.name ?? "",
            })}
          </Text>
          <Text>
            {t("screen.categoryDetail.targetDescription", {
              categoryName: category?.name ?? "",
            })}
          </Text>
          <View style={{ marginTop: 32 }}>
            <CardButton title={t("screen.categoryDetail.createTarget")} />
          </View>
        </ViewContent>
      </View>
      <View style={{ gap: 8, marginTop: 16 }}>
        <CardButton
          iconLeft="edit"
          type="secondary"
          title={t("screen.categoryDetail.actions.rename")}
          onPress={() => {
            console.log("Edit category");
          }}
        />
        <CardButton
          iconLeft="eye-slash"
          type="secondary"
          title={t("screen.categoryDetail.actions.hide")}
          onPress={() => {
            console.log("Edit category");
          }}
        />
        <CardButton
          iconLeft="trash"
          type="secondary"
          title={t("screen.categoryDetail.actions.delete")}
          onPress={() => {
            console.log("Edit category");
          }}
        />
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

const WarningBlock = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.block}>
      <Text style={styles.title}>
        {t("screen.categoryDetail.warning.title")}
      </Text>
      <ViewContent style={styles.container}>
        <LineItem
          title={t("screen.categoryDetail.warning.upcoming", {
            total: 2,
          })}
          value={0}
        />
        <LineItem
          hideBorder
          title={t("screen.categoryDetail.warning.availableAfterUpcoming")}
          value={0}
        />
      </ViewContent>
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
