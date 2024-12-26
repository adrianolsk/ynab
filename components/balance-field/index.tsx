import { StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { Switch } from "../switch";
import Decimal from "decimal.js";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View, ViewContent } from "../Themed";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";

export const BalanceField = (props: any) => {
  const isOn = useSharedValue(true);

  const { control, handleSubmit, setValue, watch, getValues, reset } = useForm({
    defaultValues: {
      amount: props.value?.toString(),
    },
  });

  // const amountValue = watch("amount");

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
  }, [props.value]);

  const handlePress = () => {
    const isPositive = !isOn.value;
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
    fontFamily: "NunitoSansMedium",
  },
});
