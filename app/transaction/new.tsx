import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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
import { ViewContent } from "@/components/Themed";
import { TextField } from "@/components/text-field";

const NewTransactionScreen = () => {
  const [nickName, setNickName] = useState<string | undefined>("");
  const [notes, setNotes] = useState<string | undefined>("");

  const onChangeText = (text: string) => {
    setNickName(text);
  };

  const handleChangeNotes = (text: string) => {
    setNotes(text);
  };
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
      <ViewContent style={styles.rowCard}>
        <TextField
          placeholder="Account Nickname"
          onChangeText={onChangeText}
          style={{}}
          value={nickName}
        />
        <View style={styles.separator} />
        <TextField
          placeholder="Notes"
          onChangeText={handleChangeNotes}
          value={notes}
        />
      </ViewContent>
    </View>
  );
};

export default NewTransactionScreen;

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#aaa",
    height: 0.2,
    width: "100%",
  },
  rowCard: {
    borderRadius: 6,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginVertical: 8,
  },
});
