import { Text } from "@/components/Themed";
import { MonthModal } from "@/components/mont-modal";
import ScreenView from "@/components/screen-view";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";

const Test = () => {
  const [isVisible, setModalVisible] = useState(false);

  const onDismiss = () => {
    setModalVisible(false);
  };

  return (
    <ScreenView>
      <MonthModal
        onChange={function (year: number, month: string): void {
          console.log("🍎 year", { year, month });
        }}
        isVisible={isVisible}
        onDismiss={onDismiss}
      />

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ alignSelf: "center" }}>Show Modal</Text>
      </Pressable>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
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

export default Test;
