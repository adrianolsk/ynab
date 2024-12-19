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
import { TextField } from "@/components/text-field";
import { Switch } from "@/components/switch";
import { useSharedValue } from "react-native-reanimated";
import { BalanceField } from "@/components/balance-field";
import { CardButton } from "@/components/card-button";

export default function EditAccountScreen() {
  const router = useRouter();
  const isOn = useSharedValue(false);

  const handlePress = () => {
    isOn.value = !isOn.value;
  };
  const [nickName, setNickName] = useState<string | undefined>("");
  const [notes, setNotes] = useState<string | undefined>("");

  const [balance, setBalance] = useState<number | null>();
  const onChangeText = (text: string) => {
    setNickName(text);
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
        console.log("🍎result", { result });
        setNotes(result.notes ?? "");
        setBalance(result.balance);
        setNickName(result.name);
      });
  }, [params.id]);

  const addAccount = async () => {
    console.log("addAccount", { nickName, notes, balance });

    if (!nickName) {
      alert("Please enter a valid name and type");
      return;
    }

    try {
      if (!params.id) return;

      console.log("🐌 balance", { balance });
      const id = parseInt(params.id);
      const response = db
        .update(AccountsSchema)
        .set({
          notes: notes,
          name: nickName,
          balance,
          // account_group: params?.accountGroup,
        })
        .where(eq(AccountsSchema.id, id));

      console.log("response", { response: (await response).lastInsertRowId });
      router.dismiss();
    } catch (error) {
      console.log("error", { error });
    }
  };

  const handleChangeText = (numericValue: number) => {
    // Allow only numeric values

    setBalance(numericValue);
  };

  const handleChangeNotes = (text: string) => {
    setNotes(text);
  };
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Edit Account",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Text style={styles.sectionTitle}>Account information </Text>

      <View style={styles.rowCard}>
        <TextField
          placeholder="Account Nickname"
          onChangeText={onChangeText}
          value={nickName}
        />
        <View style={styles.separator} />
        <TextField
          placeholder="Notes"
          onChangeText={handleChangeNotes}
          value={notes}
        />
      </View>
      <Text style={styles.sectionTitle}>Today's Balance </Text>

      <View style={styles.row}>
        <BalanceField onChangeText={handleChangeText} value={balance} />
        <Text style={styles.info}>
          An adjustment transaction will be created automatically if you change
          this amount.{" "}
        </Text>
      </View>

      <View style={[styles.row, { marginTop: 32 }]}>
        <CardButton text="Save Account" type="primary" onPress={addAccount} />
      </View>
      <View style={styles.row}>
        <CardButton text="Close Account" type="destructive" />
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "transparent",
    // backgroundColor: "#EDF1F5",
    // height: "50%",
    borderWidth: 5,
    borderColor: "red",
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    // fontFamily: "SpaceMono",
    // fontFamily: "NunitoSans",
    fontFamily: "NunitoSansSemiBold",
    // fontFamily: "NunitoSansLight",
    // fontFamily: "NunitoSansBold",
    color: "#000",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "LatoRegular",
  },
  separator: {
    // borderTopWidth: 0.5,
    // borderColor: "#ccc",
    backgroundColor: "#aaa",
    height: 0.2,
    width: "100%",
  },
  rowCard: {
    // borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    // paddingTop: 16,
    backgroundColor: "#fff",
    // marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginVertical: 8,
  },
  row: {
    backgroundColor: "transparent",
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
    backgroundColor: "#fff",
    fontFamily: "NunitoSansLight",
  },
  info: {
    fontWeight: "300",
    marginTop: 8,
    fontSize: 12,
    color: "#000",

    fontFamily: "NunitoSansLight",
  },
});
