import { Text } from "@/components/Themed";
import { ModalView } from "@/components/modal-view";
import { db } from "@/database/db";
import { MonthlyAllocationsSchema } from "@/database/schemas/montly-allocation.schema";
import { FontAwesome } from "@expo/vector-icons";
import { format, addMonths, parse } from "date-fns";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { FONT_FAMILIES } from "@/utils/constants";
import { useLocalSearchParams } from "expo-router";

const months: Array<Array<MonthName>> = [
  ["01", "02", "03"],
  ["04", "05", "06"],
  ["07", "08", "09"],
  ["10", "11", "12"],
] as const;

const monthNames = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
] as const;

type MonthName = (typeof monthNames)[number];

interface MonthModalProps {
  onChange: (month: string) => void;
  isVisible: boolean;
  onDismiss: () => void;
}
const MonthModal = ({ onChange, isVisible, onDismiss }: MonthModalProps) => {
  const params = useLocalSearchParams<{
    currentMonth: string;
  }>();
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(
    format(parse(params.currentMonth, "yyyy-MM", new Date()), "yyyy-MM")
  );

  const [selectedYear, setSelectedYear] = useState(
    parse(params.currentMonth, "yyyy-MM", new Date()).getFullYear()
  );

  const { data } = useLiveQuery(
    db
      .selectDistinct({ month: MonthlyAllocationsSchema.month })
      .from(MonthlyAllocationsSchema)
  );

  const isEnabled = useCallback(
    (month: string) => {
      const hasData = data.some((x) => x.month === month);
      const thisMonth = format(new Date(), "yyyy-MM");
      const nextMonth = format(addMonths(new Date(), 1), "yyyy-MM");
      return hasData || month === thisMonth || month === nextMonth;
    },
    [data]
  );

  const { t } = useTranslation();

  const previousYear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedYear((x) => x - 1);
  };

  const nextYear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedYear((x) => x + 1);
  };

  const onMonthPress = (month: MonthName) => () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const pressedMonth = `${selectedYear}-${month}`;
    if (isEnabled(pressedMonth)) {
      setSelectedYearMonth(pressedMonth);
      onChange(pressedMonth);
      requestAnimationFrame(onDismiss);
    }
  };

  return (
    <ModalView
      onDismiss={onDismiss}
      modalContentStyle={styles.modalContentStyle}
      isVisible={isVisible}
      header={
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPressIn={previousYear}
            style={({ pressed }) => [
              styles.navigationButton,
              pressed && styles.navigationButtonPressed,
            ]}
          >
            <FontAwesome name="chevron-left" color="#2C50B2" size={20} />
          </Pressable>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.textYear}>{selectedYear}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.navigationButton,
              pressed && styles.navigationButtonPressed,
            ]}
            onPressIn={nextYear}
          >
            <FontAwesome name="chevron-right" color="#2C50B2" size={20} />
          </Pressable>
        </View>
      }
    >
      {months.map((row, index) => (
        <View key={index} style={{ flexDirection: "row" }}>
          {row.map((month) => {
            const isMonthEnabled = isEnabled(`${selectedYear}-${month}`);
            return (
              <Pressable
                key={month}
                onPressIn={onMonthPress(month)}
                style={({ pressed }) => [
                  styles.monthButton,
                  {
                    backgroundColor: pressed ? "#2C50B2" : "transparent",
                  },
                  {
                    backgroundColor:
                      `${selectedYear}-${month}` === selectedYearMonth
                        ? "#2C50B2"
                        : "transparent",
                  },
                ]}
              >
                <View>
                  <Text
                    style={{
                      color: isMonthEnabled ? "white" : "#555",
                    }}
                  >
                    {t(`months.${month}`)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </ModalView>
  );
};

const styles = StyleSheet.create({
  monthButton: {
    flex: 1,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  navigationButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  navigationButtonPressed: {
    backgroundColor: "#2C50B2",
  },
  textYear: {
    fontSize: 16,
    fontFamily: FONT_FAMILIES.SemiBold,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  modalContentStyle: {
    padding: 0,
  },
});

export { MonthModal };
