import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { Switch } from "../switch";
import { TextInput, ViewContent } from "../Themed";
import { FONT_FAMILIES } from "@/utils/constants";

export const BalanceField = (props: any) => {
  const isOn = useSharedValue(true);

  const { control, setValue, getValues, reset } = useForm({
    defaultValues: {
      amount: props.value?.toString(),
    },
  });

  useEffect(() => {
    const currency = getValues("amount");

    if (!currency && props.value) {
      reset({
        amount: formatCurrency(props.value),
      });
      if (props.value < 0) {
        isOn.value = false;
      }
    }
  }, [getValues, isOn, props.value, reset]);

  const handlePress = () => {
    const multiplyer = -1;
    const currency = getValues("amount");
    const numericValue = parseCurrencyToDecimal(currency);

    const numericValueToFormat = numericValue * multiplyer;

    props.onChangeText(numericValueToFormat);
    setValue("amount", formatCurrency(numericValueToFormat));
    isOn.value = !isOn.value;
  };

  const borderColor =
    !props.value || props.value >= 0 ? styles.positive : styles.negative;

  return (
    <ViewContent style={[styles.container, borderColor]}>
      <ViewContent style={{ flex: 1 }}>
        <Controller
          name="amount"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={value}
              keyboardType="numeric"
              onChangeText={(text) => {
                const currency = parseCurrencyToDecimal(text);
                const formattedValue = formatCurrency(currency);
                onChange(formattedValue); // Update the form value
                setValue("amount", formattedValue); // Ensure state is updated
                props.onChangeText(currency);
              }}
            />
          )}
        />
      </ViewContent>

      <Switch value={isOn} onPress={handlePress} />
    </ViewContent>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 6,
    // backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderColor: "#bbb",
    alignItems: "center",
  },
  positive: {
    borderColor: "#4D9119",
  },
  negative: {
    borderColor: "#C72C1E",
  },
  input: {
    fontFamily: FONT_FAMILIES.Medium,
  },
});
