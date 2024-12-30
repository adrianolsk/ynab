import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";

interface ProgressBarProps {
  target: number;
  availableAmount: number;
  spentAmount: number;
  rolloverAmount: number;
  allocatedAmount: number;
}
const ProgressBar = ({
  target,
  availableAmount,
  spentAmount,
  rolloverAmount,
  allocatedAmount,
}: ProgressBarProps) => {
  const availableAmountComponent = useMemo(() => {
    if (availableAmount === 0) {
      return (
        <View style={{ width: "100%", height: 6, backgroundColor: "gray" }} />
      );
    }

    if (availableAmount < 0) {
      const alocatedPercent = Math.floor(
        (allocatedAmount / (target === 0 ? 1 : target)) * 100
      );

      const alocatedPercent2 = Math.floor(
        (allocatedAmount / (spentAmount * -1)) * 100
      );
      console.log("🍎 alocatedPercent", {
        alocatedPercent,
        availableAmount,
        target,
        spentAmount,
      });
      return (
        <View style={{ width: "100%" }}>
          <View
            style={{
              width: "100%",
              height: 6,
              backgroundColor: "red",
              position: "absolute",
            }}
          />
          {target > 0 && (
            <View
              style={{
                width: `${alocatedPercent}%`,
                height: 6,
                backgroundColor: "#FFD700",
                position: "absolute",
              }}
            />
          )}
          {!target && allocatedAmount > 0 && (
            <View
              style={{
                width: `${alocatedPercent2}%`,
                height: 6,
                backgroundColor: "#4B9828",
                position: "absolute",
              }}
            />
          )}
        </View>
      );
    }
    const color = availableAmount < target ? "#FFD700" : "#4B9828";
    const firstValue = availableAmount < target ? availableAmount : target;
    return (
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          width: `${(firstValue / target) * 100}%`,
          height: 6,
          backgroundColor: color,
        }}
      />
    );
  }, [availableAmount]);

  return (
    <View style={styles.progressContainer}>{availableAmountComponent}</View>
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
