import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import { Stack } from "expo-router";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import { TransactionTypeSwitch } from "@/components/transaction-type-switch";

const NewTransactionScreen = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen
        options={{
          headerTitle: "Add Transaction",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <TransactionTypeSwitch
        type="outflow"
        onChange={(type) => {
          console.log("type", { type });
        }}
      />
    </View>
  );
};

export default NewTransactionScreen;

const styles = StyleSheet.create({});
