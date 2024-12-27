import React, { useCallback, useEffect } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type TransactionType = "outflow" | "inflow";

interface TransactionTypeSwitchProps {
  type: TransactionType;
  onChange: (type: TransactionType) => void;
}

export const TransactionTypeSwitch = ({
  onChange,
  type,
}: TransactionTypeSwitchProps) => {
  const value = useSharedValue(0);
  const [width, setWidth] = React.useState(0);

  useEffect(() => {
    if (type === "outflow") {
      value.value = 0;
    } else {
      value.value = 1;
    }
  }, [type]);

  const animatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(value.value, [0, 1], ["#F14839", "#4B9828"]);
    const colorValue = withTiming(color, { duration: 100 });

    return {
      backgroundColor: colorValue,
      transform: [{ translateX: value.value * (width / 2) }],
    };
  });

  const onPress = useCallback(() => {
    if (value.value === 0) {
      value.value = withTiming(1, { duration: 300 });
      onChange("inflow");
    } else {
      onChange("outflow");
      value.value = withTiming(0, { duration: 300 });
    }
  }, [value]);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setWidth(nativeEvent.layout.width);
  }, []);

  return (
    <View
      onLayout={onLayout}
      style={{
        marginTop: 16,
        borderRadius: 100,
        flexDirection: "row",
        overflow: "hidden",
        backgroundColor: "#0C1722",
        height: 48,
      }}
    >
      <Animated.View style={[styles.selectedItem, animatedStyle]} />
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
        }}
      >
        <View style={styles.item}>
          <Text style={styles.text}>- Outflow</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={onPress}
        style={{
          flex: 1,
        }}
      >
        <View style={styles.item}>
          <Text style={styles.text}>+ Inflow</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedItem: {
    position: "absolute",
    height: 48,
    width: "50%",
    backgroundColor: "#005583",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  text: {
    fontSize: 14,
    fontFamily: "NunitoSansBold",
    color: "#fff",
  },
  selectedText: {
    color: "#fff",
  },
});
