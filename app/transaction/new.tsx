import { ViewContent } from "@/components/Themed";
import { CardButton } from "@/components/card-button";
import ScreenView from "@/components/screen-view";
import { Switch2 } from "@/components/switch";
import { TextField } from "@/components/text-field";
import { TransactionTypeSwitch } from "@/components/transaction-type-switch";
import { db } from "@/database/db";
import {
  TransactionsSchema,
  TransactionsSchemaType,
} from "@/database/schemas/transactions.schema";
import { updateSpentAmount } from "@/database/services/monthly-allocations.service";
import { getBudgetUuid } from "@/services/storage";
import { uuidV4 } from "@/utils/helpers";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

interface SelectedItem {
  uuid: string;
  name: string;
}

const NewTransactionScreen = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<SelectedItem>();
  const [selectedAccount, setSelectedAccount] = useState<SelectedItem>();
  const [selectedPayee, setSelectedPayee] = useState<SelectedItem>();
  const [isCleared, setIsCleared] = useState(false);
  const [transactionType, setTransactionType] = useState<"inflow" | "outflow">(
    "outflow"
  );
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState("");

  const router = useRouter();

  const params = useLocalSearchParams<{
    categoryUuid: string;
    categoryName: string;
    accountUuid: string;
    accountName: string;
    payeeUuid: string;
    payeeName: string;
  }>();

  useEffect(() => {
    if (!params.categoryUuid) return;
    setSelectedCategory({
      uuid: params.categoryUuid,
      name: params.categoryName,
    });
  }, [params.categoryName, params.categoryUuid]);

  useEffect(() => {
    if (!params.accountUuid) return;
    setSelectedAccount({
      uuid: params.accountUuid,
      name: params.accountName,
    });
  }, [params.accountName, params.accountUuid]);

  useEffect(() => {
    if (!params.payeeUuid) return;
    setSelectedPayee({
      uuid: params.payeeUuid,
      name: params.payeeName,
    });
  }, [params.payeeName, params.payeeUuid]);

  const handleOpenCalendar = useCallback(() => {
    if (Platform.OS === "ios") {
      setShowDatePicker((s) => !s);
    } else {
      DateTimePickerAndroid.open({
        mode: "date",
        is24Hour: true,
        value: new Date(),
        onChange(event, date) {
          if (date) {
            setSelectedDate(date);
          }
        },
      });
    }
  }, []);

  const handleDateChange = useCallback((event: any, selectedDate: any) => {
    setShowDatePicker(false);
    setSelectedDate(selectedDate);
  }, []);

  const addTransaction = async () => {
    if (!selectedAccount || !selectedCategory || !selectedPayee) {
      alert("Please select an account, category and payee");
      return;
    }
    const data: TransactionsSchemaType = {
      uuid: uuidV4(),
      account_uuid: selectedAccount?.uuid,
      category_uuid: selectedCategory?.uuid,
      payee_uuid: selectedPayee?.uuid,
      date: format(selectedDate, "yyyy-MM-dd"),
      amount: amount,
      description: notes,
      cleared: isCleared,
    };

    const budgetUuid = await getBudgetUuid();

    await db.insert(TransactionsSchema).values(data);
    await updateSpentAmount({
      budget_uuid: budgetUuid!,
      month: format(selectedDate, "yyyy-MM"),
      value: amount,
      categoryUuid: selectedCategory?.uuid,
    });
    router.dismiss();
  };
  return (
    <ScreenView>
      <Stack.Screen
        options={{
          headerTitle: "Add Transaction",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <TransactionTypeSwitch
        type={transactionType}
        onChange={(type, value) => {
          console.log("type", { type });
          setTransactionType(type);
          setAmount(value);
        }}
      />
      <ViewContent style={styles.rowCard}>
        <TextField
          placeholder="Payee"
          style={{}}
          value={selectedPayee?.name}
          onPress={() =>
            router.push({
              pathname: "/payee.modal",
              params: {
                id: 1,
                type: "transaction",
              },
            })
          }
          icon="building-o"
        />
        <View style={styles.separator} />
        <TextField
          placeholder="Choose a Category"
          onPress={() =>
            router.push({
              pathname: "/category.modal",
              params: {
                id: 1,
                type: "transaction",
              },
            })
          }
          value={selectedCategory?.name}
          icon="money"
        />
        <View style={styles.separator} />
        <TextField
          placeholder="Account"
          onPress={() =>
            router.push({
              pathname: "/accounts.modal",
              params: {
                id: 1,
                type: "transaction",
              },
            })
          }
          value={selectedAccount?.name}
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
      <ViewContent style={[styles.rowCard]}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <TextField
              placeholder="Cleared"
              onChangeText={() => {}}
              onPress={handleOpenCalendar}
              value={undefined}
              icon="check-circle-o"
              iconColor={isCleared ? "#4D9119" : "#aaa"}
            />
          </View>
          <View>
            <Switch2
              checked={isCleared}
              onPress={setIsCleared}
              showIcon={false}
            />
          </View>
        </View>
        <View>
          <View style={styles.separator} />
          <TextField
            multiline
            placeholder="Notes"
            onChangeText={setNotes}
            value={notes}
            icon="book"
          />
        </View>
      </ViewContent>

      <View style={styles.row}>
        <CardButton
          title="Add Transaction"
          type="primary"
          onPress={addTransaction}
        />
      </View>
    </ScreenView>
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
  row: {
    // paddingHorizontal: 16,
    paddingTop: 32,
  },
  separator: {
    backgroundColor: "#555",
    height: 1,
    width: "100%",
  },
  rowCard: {
    borderRadius: 16,

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
