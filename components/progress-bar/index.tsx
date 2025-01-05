import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import { StripedProgressBar } from "../stripped-progress-bar";

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
  allocatedAmount,
}: ProgressBarProps) => {
  const availableAmountComponent = useMemo(() => {
    if (availableAmount === 0) {
      return (
        <View
          style={{ width: "100%", height: 5, backgroundColor: "#1F2C3A" }}
        />
      );
    }
    if (availableAmount > 0 && target === 0) {
      return (
        <View
          style={{ width: "100%", height: 5, backgroundColor: "#4B9828" }}
        />
      );
    }

    if (availableAmount < 0) {
      const alocatedPercent = Math.floor(
        (allocatedAmount / (target === 0 ? 1 : target)) * 100
      );

      const spentPercentage = Math.floor(
        (allocatedAmount / (spentAmount * -1)) * 100
      );

      return (
        <View style={{ width: "100%" }}>
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#C50500",
              position: "absolute",
            }}
          >
            <StripedProgressBar
              progress={spentPercentage}
              stripeColor="#C50500"
              backgroundColor="#890300"
            />
          </View>
          {target > 0 && (
            <View
              style={{
                width: `${alocatedPercent}%`,
                height: "100%",
                backgroundColor: "#FFD700",
                position: "absolute",
              }}
            >
              <StripedProgressBar
                progress={spentPercentage}
                stripeColor="#FFD700"
                backgroundColor="#D1B000"
              />
            </View>
          )}
          {!target && allocatedAmount > 0 && (
            <View
              style={{
                width: `${spentPercentage}%`,
                height: "100%",
                backgroundColor: "#4B9828",
                position: "absolute",
              }}
            >
              <StripedProgressBar
                progress={spentPercentage}
                stripeColor="#4B9828"
                backgroundColor="#37701D"
              />
            </View>
          )}
        </View>
      );
    }
    const color = availableAmount < target ? "#FFD700" : "#4B9828";
    const firstValue = availableAmount < target ? availableAmount : target;
    const progress = (firstValue / target) * 100;

    return (
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          width: `${progress}%`,
          height: "100%",
          backgroundColor: color,
        }}
      />
    );
  }, [allocatedAmount, availableAmount, spentAmount, target]);

  // return <StripedProgressBar progress={10} />;
  return (
    <View style={styles.progressContainer}>{availableAmountComponent}</View>
  );
};

export { ProgressBar };

const styles = StyleSheet.create({
  progressContainer: {
    height: 5,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#1F2C3A",
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#aaa",
  },
});
