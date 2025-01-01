import { Text } from "@/components/Themed";
import { ModalView } from "@/components/modal-view";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";

const months: Array<Array<MonthName>> = [
  ["january", "february", "march"],
  ["april", "may", "june"],
  ["july", "august", "september"],
  ["october", "november", "december"],
] as const;

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

type MonthName = (typeof monthNames)[number];

interface MonthModalProps {
  onChange: (year: number, month: string) => void;
  isVisible: boolean;
  onDismiss: () => void;
}
const MonthModal = ({ onChange, isVisible, onDismiss }: MonthModalProps) => {
  //   const [modalVisible, setModalVisible] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<MonthName>(() => {
    const date = new Date();
    return monthNames[date.getMonth()];
  });

  const { t } = useTranslation();

  const previousYear = () => {
    setSelectedYear((x) => x - 1);
  };

  const nextYear = () => {
    setSelectedYear((x) => x + 1);
  };

  const onMonthPress = (month: MonthName) => () => {
    setCurrentMonth(month);
    onChange(selectedYear, month);
    onDismiss();
  };

  return (
    <ModalView
      modalContentStyle={styles.modalContentStyle}
      isVisible={isVisible}
      header={
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={previousYear}
            style={styles.navigationButton}
          >
            <FontAwesome name="chevron-left" color="#2C50B2" size={20} />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.textYear}>{selectedYear}</Text>
          </View>
          <TouchableOpacity onPress={nextYear} style={styles.navigationButton}>
            <FontAwesome name="chevron-right" color="#2C50B2" size={20} />
          </TouchableOpacity>
        </View>
      }
      onDismiss={onDismiss}
    >
      {months.map((row, index) => (
        <View key={index} style={{ flexDirection: "row" }}>
          {row.map((month, index) => (
            <Pressable
              onPress={onMonthPress(month)}
              style={({ pressed }) => [
                styles.monthButton,
                {
                  backgroundColor: pressed ? "#2C50B2" : "transparent",
                },
                {
                  backgroundColor:
                    currentMonth === month && selectedYear === currentYear
                      ? "#2C50B2"
                      : "transparent",
                },
              ]}
            >
              <View key={index}>
                <Text>{t(`months.${month}`)}</Text>
              </View>
            </Pressable>
          ))}
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
  textYear: {
    fontSize: 16,
    fontFamily: "NunitoSansBold",
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
