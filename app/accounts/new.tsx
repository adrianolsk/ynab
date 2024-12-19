import { StatusBar } from "expo-status-bar";
import {
  Button,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  Text,
  View,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
// import { Text, View } from "@/components/Themed";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { db } from "@/database/db";
import * as schema from "@/database/schemas/user-schema";
import { AccountsSchema } from "@/database/schemas/accounts-schema";
import { AccountGroup } from "@/database/types";

export default function NewAccountScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [accountType, setAccountType] = useState<string | undefined>();
  const [balance, setBalance] = useState("");
  const onChangeText = (text: string) => {
    setText(text);
  };

  const params = useLocalSearchParams<{
    id?: string;
    accountGroup: AccountGroup;
  }>();
  useEffect(() => {
    if (!params.id) return;
    setAccountType(params.id);
  }, [params.id]);

  const addAccount = async () => {
    const value: number = parseFloat(balance);

    console.log("addAccount", { text, accountType, balance, value });
    if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    if (!text || !accountType) {
      alert("Please enter a valid name and type");
      return;
    }

    try {
      const response = db.insert(AccountsSchema).values({
        name: text,
        account_type: accountType,
        user_id: 2,
        balance: value,
        account_group: params?.accountGroup,
      });
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
        <Link href="/modal" asChild>
          <Pressable>
            <TextInput
              editable={false}
              placeholder="My checkings account"
              style={styles.input}
              placeholderTextColor={"#aaa"}
              onChangeText={(text) => onChangeText(text)}
              value={params.id}
            />
          </Pressable>
        </Link>
      </View>
      <View style={styles.row}>
        <Text>What is your current account balance? </Text>

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

      <Button title="Next" onPress={addAccount} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      {/* <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#EDF1F5",
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
