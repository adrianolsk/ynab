import React, { useCallback, useEffect, useRef } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TextInput, useThemeColor } from "../Themed";
import { format, set } from "date-fns";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { NumericKeyboard } from "../numeric-keyboard";

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
  const [amount, setAmount] = React.useState(0);

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

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleOpenKeyboard = async () => {
    bottomSheetRef.current?.present();
  };

  const backgroundColor = useThemeColor({}, "backgroundContent");

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
            // borderWidth: 1,
            // borderColor: "#999",
            height: 60,
          }}
        >
          <Text style={styles.input}>{formatCurrency(amount)}</Text>
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
              // setCurrentAllocatedAmount(0);
              // setIsOpen(false);
              // setEditedItems({});
              // handleClosePress();
              // closeBottomSheet();
            }}
            onPress={async function (value: string) {
              // const key = activeItem!.item.uuid;
              const lastValue = amount ?? "";
              const newValue = lastValue + value;
              setAmount(parseCurrencyToDecimal(newValue));
              // setEditedItems((items) => {
              //   return {
              //     ...items,
              //     [key]: newValue,
              //   };
              // });
            }}
            onBackspace={function (): void {
              const lastValue = formatCurrency(amount) ?? "";

              const newValue = lastValue.slice(0, -1);
              setAmount(parseCurrencyToDecimal(newValue));
            }}
            onConfirm={async function () {
              handleClosePress();
              // handleClosePress();
              // closeBottomSheet();
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "NunitoSansBold",
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
