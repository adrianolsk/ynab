import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";

const NewTransactionScreen = () => {
  const [nickName, setNickName] = useState<string | undefined>("oi");
  const [notes, setNotes] = useState<string | undefined>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const onChangeText = (text: string) => {
    setNickName(text);
  };

  const handleChangeNotes = (text: string) => {
    setNotes(text);
  };

  const handlePress = () => {
    console.log("🍎 handlePress");
  };

  const handleOpenCalendar = useCallback(() => {
    console.log("🍎 handleOpenCalendar");
    if (Platform.OS === "ios") {
      setShowDatePicker((s) => !s);
    } else {
      DateTimePickerAndroid.open({
        mode: "date",
        is24Hour: true,
        value: new Date(),
        onChange(event, date) {
          console.log("🍎 onChange", { event, date });
          if (date) {
            setSelectedDate(date);
          }
        },
      });
    }
  }, [showDatePicker]);

  const handleDateChange = useCallback((event: any, selectedDate: any) => {
    console.log("🍎 handleDateChange", { event, selectedDate });
    setShowDatePicker(false);
    setSelectedDate(selectedDate);
  }, []);
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
          placeholder="Payee"
          onChangeText={onChangeText}
          style={{}}
          value={nickName}
          onPress={handlePress}
          icon="building-o"
        />
        <View style={styles.separator} />
        <TextField
          placeholder="Choose a Category"
          onChangeText={handleChangeNotes}
          value={notes}
          icon="money"
        />
        <View style={styles.separator} />
        <TextField
          placeholder="Account"
          onChangeText={handleChangeNotes}
          value={notes}
          icon="bank"
        />
        <View style={styles.separator} />
        <TextField
          placeholder="Date"
          onChangeText={() => {}}
          onPress={handleOpenCalendar}
          value={format(selectedDate, "dd/MM/yyyy")}
          icon="calendar-o"
        />

        <IOSDatePicker onChange={handleDateChange} show={showDatePicker} />
      </ViewContent>
    </View>
  );
};

export default NewTransactionScreen;

const IOSDatePicker = React.memo(
  ({
    onChange,
    show,
  }: {
    show: boolean;
    onChange: (event: any, selectedDate: any) => void;
  }) => {
    if (!show) return null;
    return (
      <DateTimePicker
        value={new Date()}
        mode="date"
        display="inline"
        onChange={onChange}
      />
    );
  }
);

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#555",
    height: 1,
    width: "100%",
  },
  rowCard: {
    borderRadius: 16,
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
