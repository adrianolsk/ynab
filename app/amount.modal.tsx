import { NumericKeyboard } from "@/components/numeric-keyboard";
import ScreenView from "@/components/screen-view";
import { Text, useThemeColor } from "@/components/Themed";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { default as React, useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";

const NewTransactionScreen = () => {
  const router = useRouter();
  const [amount, setAmount] = React.useState("0");
  const params = useLocalSearchParams<{
    amount: string;
  }>();
  useEffect(() => {
    if (params.amount) {
      setAmount(params.amount);
    }
  }, [params.amount]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleOpenKeyboard = async () => {
    bottomSheetRef.current?.present();
  };
  useEffect(() => {
    handleOpenKeyboard();
  }, []);

  const backgroundColor = useThemeColor({}, "backgroundContent");

  return (
    <ScreenView>
      <Stack.Screen
        options={{
          headerTitle: "Amount",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <View
        style={{
          paddingTop: "50%",
          alignItems: "center",
        }}
      >
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[styles.input, styles.inflowStyle]}
        >
          {formatCurrency(parseCurrencyToDecimal(amount))}
        </Text>
      </View>
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
              router.dismiss();
            }}
            onPress={async function (value: string) {
              const lastValue = amount ?? "";
              const newValue = lastValue + value;
              setAmount(newValue);
              //   onChange(type, parseCurrencyToDecimal(newValue));
            }}
            onBackspace={function (): void {
              const lastValue = amount ?? "";

              const newValue = lastValue.slice(0, -1);
              setAmount(newValue);
            }}
            onConfirm={async function () {
              router.dismissTo({
                pathname: "/target.screen",
                params: {
                  amount,
                },
              });
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </ScreenView>
  );
};

export default NewTransactionScreen;

const styles = StyleSheet.create({
  input: {
    fontSize: 48,
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
