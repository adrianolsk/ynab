import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { Switch } from "../switch";
import Decimal from "decimal.js";
import { Controller, useForm } from "react-hook-form";

// function formatCurrency(value?: string) {
//   if (!value) {
//     return "";
//   }
//   // Convert the Decimal value to a number
//   const number = new Decimal(value).toNumber();

//   // Format the number into the desired currency format
//   const formatter = new Intl.NumberFormat("pt-BR", {
//     style: "currency",
//     currency: "BRL",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   // Replace the default currency symbol with "$"
//   return formatter.format(number).replace("US$", "$");
// }

// function formatCurrency(value?: string) {
//   if (!value) {
//     return "";
//   }
//   // Remove non-numeric characters except for commas and periods
//   const numericValue = value.replace(/[^0-9,]/g, "").replace(",", ".");
//   const number = new Decimal(numericValue);

//   // Convert to a number and format as currency
//   const formattedValue = new Intl.NumberFormat("pt-BR", {
//     style: "currency",
//     currency: "BRL",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(number.toNumber() || 0);

//   // Replace default "US$" with "$" if necessary
//   return formattedValue.replace("US$", "$");
// }

// function formatCurrency(value: String) {
//   // Remove all non-numeric characters except for the period and comma
//   const numericValue = value.replace(/[^0-9-]/g, "");

//   // Add commas for thousands and format as currency
//   const formattedValue = new Intl.NumberFormat("pt-BR", {
//     style: "currency",
//     currency: "BRL",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(parseFloat(numericValue) / 100); // Divide by 100 for cents

//   // Replace default "US$" with "$"
//   return formattedValue; //.replace("US$", "$");
// }

function formatCurrency(numericValue: number) {
  // Remove all non-numeric characters except for the period and comma

  // Add commas for thousands and format as currency
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue); // Divide by 100 for cents

  // Replace default "US$" with "$"
  return formattedValue; //.replace("US$", "$");
}

function parseCurrencyToDecimal(currency: string) {
  // Remove all non-digit characters
  const numericString = currency.replace(/[^\d-]/g, "");

  // Convert to Decimal and divide by 100
  const value = new Decimal(numericString).dividedBy(100);

  return value.toNumber();
}

export const BalanceField = (props: any) => {
  //   const [text, setText] = useState<string | undefined>(
  //     formatCurrency(props.value)
  //   );
  const isOn = useSharedValue(true);

  const { control, handleSubmit, setValue, watch, getValues, reset } = useForm({
    defaultValues: {
      amount: props.value?.toString(),
    },
  });

  //   const amountValue = watch("amount");

  useEffect(() => {
    const currency = getValues("amount");
    console.log("🍎WATCH", { currency, value: props.value });
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
    console.log("🥭isOn", isPositive);
    const multiplyer = -1;
    const currency = getValues("amount");
    const numericValue = parseCurrencyToDecimal(currency);

    const numericValueToFormat = numericValue * multiplyer;

    props.onChangeText(numericValueToFormat);
    setValue("amount", formatCurrency(numericValueToFormat));
    isOn.value = !isOn.value;
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Controller
          name="amount"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
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
      </View>

      <Switch value={isOn} onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderColor: "#999",
    alignItems: "center",
  },
});
