import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { NumericKeyboard } from "../numeric-keyboard";
import { useThemeColor } from "../Themed";

type TransactionType = "outflow" | "inflow";

interface TransactionTypeSwitchProps {
  type: TransactionType;
  onChange: (type: TransactionType, value: number) => void;
}

export const TransactionTypeSwitch = ({
  onChange,
  type,
}: TransactionTypeSwitchProps) => {
  const value = useSharedValue(0);
  const [width, setWidth] = React.useState(0);
  const [amount, setAmount] = React.useState("-0");

  useEffect(() => {
    if (type === "outflow") {
      value.value = 0;
    } else {
      value.value = 1;
    }
  }, [type, value]);

  const animatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(value.value, [0, 1], ["#F14839", "#4B9828"]);
    const colorValue = withTiming(color, { duration: 100 });

    return {
      backgroundColor: colorValue,
      transform: [{ translateX: value.value * (width / 2) }],
    };
  });

  const onPress = useCallback(() => {
    // const newValue = parseCurrencyToDecimal(amount) * -1;
    // setAmount(formatCurrency(newValue));

    if (value.value === 0) {
      value.value = withTiming(1, { duration: 300 });

      setAmount((v) => {
        const value = parseCurrencyToDecimal(v) * -1;
        onChange("inflow", value);
        return formatCurrency(value);
      });
    } else {
      setAmount((v) => {
        const value = parseCurrencyToDecimal(v) * -1;
        onChange("outflow", value);
        return formatCurrency(value);
      });
      value.value = withTiming(0, { duration: 300 });
    }
  }, [onChange, value]);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setWidth(nativeEvent.layout.width);
  }, []);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleOpenKeyboard = async () => {
    bottomSheetRef.current?.present();
  };

  const backgroundColor = useThemeColor({}, "backgroundContent");

  const dynamicInputStyle =
    type === "inflow" ? styles.inflowStyle : styles.outflowStyle;
  return (
    <View>
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
      <Pressable
        onPress={handleOpenKeyboard}
        style={{
          marginTop: 16,
        }}
      >
        <View
          style={{
            padding: 16,
            alignItems: "center",

            height: 60,
          }}
        >
          <Text style={[styles.input, dynamicInputStyle]}>
            {formatCurrency(parseCurrencyToDecimal(amount))}
          </Text>
        </View>
      </Pressable>
      <BottomSheetModal
        enableContentPanningGesture={false}
        handleComponent={() => null}
        handleStyle={{
          backgroundColor: backgroundColor,
        }}
        onDismiss={handleClosePress}
        ref={bottomSheetRef}
        backgroundStyle={{
          backgroundColor: backgroundColor,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
        }}
        detached
      >
        <BottomSheetView style={{ padding: 16 }}>
          <NumericKeyboard
            hideButtons
            onCancel={async () => {
              handleClosePress();
            }}
            onPress={async function (value: string) {
              const lastValue = amount ?? "";
              const newValue = lastValue + value;
              setAmount(newValue);
              onChange(type, parseCurrencyToDecimal(newValue));
            }}
            onBackspace={function (): void {
              const lastValue = amount ?? "";

              const newValue = lastValue.slice(0, -1);
              setAmount(newValue);
            }}
            onConfirm={async function () {
              handleClosePress();
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 24,
    fontFamily: "NunitoSansBold",
  },
  inflowStyle: {
    color: "#4D9119",
  },
  outflowStyle: {
    color: "#C72C1E",
  },
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
