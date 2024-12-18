import { StatusBar } from "expo-status-bar";
import {
  Button,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { eq, lt, gte, ne } from "drizzle-orm";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { db } from "@/database/db";
import * as schema from "@/database/schemas/user-schema";
import {
  AccountsSchema,
  AccountType,
} from "@/database/schemas/accounts-schema";
import { AccountGroup } from "@/database/types";

export default function EditAccountScreen() {
  const router = useRouter();
  const [text, setText] = useState<string | undefined>("");
  const [accountType, setAccountType] = useState<string | undefined>();
  const [balance, setBalance] = useState<string | undefined>("");
  const onChangeText = (text: string) => {
    setText(text);
  };

  const params = useLocalSearchParams<{
    id?: string;
    accountGroup: AccountGroup;
  }>();

  const [account, setAccount] = useState<AccountType | undefined>();

  useEffect(() => {
    if (!params.id) return;

    const id = parseInt(params.id);
    db.select()
      .from(AccountsSchema)
      .where(eq(AccountsSchema.id, id))

      .then(([result]) => {
        // setAccount(result);
        setBalance(result.balance?.toFixed(2));
        setText(result.name);
      });
  }, [params.id]);

  const addAccount = async () => {
    if (!balance) return;
    const value: number = parseFloat(balance);

    console.log("addAccount", { text, accountType, balance, value });
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    if (!text) {
      alert("Please enter a valid name and type");
      return;
    }

    try {
      if (!params.id) return;
      const id = parseInt(params.id);
      const response = db
        .update(AccountsSchema)
        .set({
          name: text,
          account_type: accountType,
          user_id: 2,
          balance: value,
          account_group: params?.accountGroup,
        })
        .where(eq(AccountsSchema.id, id));

      console.log("response", { response: (await response).lastInsertRowId });
      router.dismiss();
    } catch (error) {
      console.log("error", { error });
    }
  };

  const handleChangeText = (text: string) => {
    // Allow only numeric values
    const numericValue = text.replace(/[^0-9]/g, "");
    setBalance(numericValue);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          // presentation: "modal",
          headerTitle: "Edit Account",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <View style={styles.row}>
        <Text>Account Nickname </Text>

        <TextInput
          placeholder="My checkings account"
          style={styles.input}
          placeholderTextColor={"#aaa"}
          onChangeText={(text) => onChangeText(text)}
          value={text}
        />
      </View>

      <View style={styles.row}>
        <Text>Today's Balance </Text>

        {/* limit to only numeric values  */}
        <TextInput
          keyboardType="numeric"
          placeholder="0.00"
          textContentType="creditCardNumber"
          //   placeholder="My checkings account"
          style={styles.input}
          onChangeText={handleChangeText}
          value={balance}
        />
      </View>

      <Button title="Save" onPress={addAccount} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "transparent",
    height: "50%",
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
    // borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    // marginBottom: 16,
  },
  input: {
    height: 40,

    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    borderColor: "#999",
  },
});
