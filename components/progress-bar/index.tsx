import { StyleSheet, Text, View } from "react-native";
import React from "react";

interface ProgressBarProps {
  target: number;
  availableAmount: number;
  spentAmount: number;
  rolloverAmount: number;
}
const ProgressBar = ({
  target,
  availableAmount,
  spentAmount,
  rolloverAmount,
}: ProgressBarProps) => {
  console.log("🍎 ProgressBar", { target, availableAmount, spentAmount });
  return (
    <View style={styles.progressContainer}>
      <View
        style={{
          flex: (spentAmount * -1) / target,
          backgroundColor: "#4B9828",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: (spentAmount * -1) / target,
            backgroundColor: "#C72C1E",
          }}
        />
      </View>
    </View>
  );
};

export { ProgressBar };

const styles = StyleSheet.create({
  progressContainer: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#ccc",
    flexDirection: "row",
  },
});
