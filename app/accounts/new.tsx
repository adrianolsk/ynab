import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

// import { Text, View } from "@/components/Themed";
import { db } from "@/database/db";
import { AccountsSchema } from "@/database/schemas/accounts.schema";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { BalanceField } from "@/components/balance-field";
import { CardButton } from "@/components/card-button";
import ScreenView from "@/components/screen-view";
import { Text, TextInput } from "@/components/Themed";
import { updateReadyToAssign } from "@/database/services/ready-to-assign.service";
import { getBudgetUuid } from "@/services/storage";
import { AccountGroup, AccountType } from "@/types";
import { uuidV4 } from "@/utils/helpers";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native-gesture-handler";

export default function NewAccountScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [text, setText] = useState("");
  const [accountType, setAccountType] = useState<string | undefined>();
  const [balance, setBalance] = useState<number | undefined>();
  const onChangeText = (text: string) => {
    setText(text);
  };

  const params = useLocalSearchParams<{
    id?: AccountType;
    // accountType: AccountType;
    accountGroup: AccountGroup;
  }>();
  useEffect(() => {
    if (!params.id) return;
    setAccountType(params.id);
  }, [params.id]);

  getBudgetUuid().then((budgetUuid) =>
    console.log("🍎 budgetUuid", { budgetUuid })
  );

  const addAccount = async () => {
    const value: number = balance ?? 0; //parseFloat(balance);

    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    if (!text || !accountType) {
      alert("Please enter a valid name and type");
      return;
    }

    try {
      await db.insert(AccountsSchema).values({
        uuid: uuidV4(),
        budget_uuid: "2",
        name: text,
        account_type: accountType as any, //: todo fix types
        balance: value,
        account_group: params?.accountGroup,
      });

      const budgetUuid = (await getBudgetUuid()) ?? "";
      await updateReadyToAssign({
        budget_uuid: budgetUuid,
        month: format(new Date(), "yyyy-MM"),
        value: value,
      });

      router.dismiss();
    } catch (error) {
      console.log("error", { error });
    }
  };

  const handleChangeText = (numericValue: number) => {
    setBalance(numericValue);
  };

  const accountTypeText = params.id
    ? t(`accountTypes.${params.id}`)
    : t("accountTypes.placeholder");

  return (
    <ScreenView>
      <StatusBar style={"auto"} />
      <Stack.Screen
        options={{
          headerTitle: "Add Account",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <View style={styles.row}>
        <Text>Give it a nickname </Text>

        <TextInput
          placeholder="My checkings account"
          style={styles.input}
          placeholderTextColor={"#aaa"}
          onChangeText={(text) => onChangeText(text)}
          value={text}
        />
      </View>
      <View style={styles.row}>
        <Text>What type of account are you adding?</Text>

        <Pressable onPress={() => router.push("/modal")}>
          <TextInput
            pointerEvents="none"
            editable={false}
            placeholder="My checkings account"
            style={styles.input}
            onChangeText={(text) => onChangeText(text)}
            value={accountTypeText}
          />
        </Pressable>
      </View>
      <View style={styles.row}>
        <Text>What is your current account balance? </Text>

        <BalanceField onChangeText={handleChangeText} value={balance} />
      </View>
      <View style={styles.row}>
        <CardButton title="Save Account" type="primary" onPress={addAccount} />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  row: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    height: 40,

    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
  },
});
