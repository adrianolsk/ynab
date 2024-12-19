import { BalanceField } from "@/components/balance-field";
import { CardButton } from "@/components/card-button";
import { TextField } from "@/components/text-field";
import { Text, View, ViewContent } from "@/components/Themed";
import { db } from "@/database/db";
import {
  AccountsSchema,
  AccountSchemaType,
} from "@/database/schemas/accounts-schema";
import { AccountGroup } from "@/database/types";
import { eq } from "drizzle-orm";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";

export default function EditAccountScreen() {
  const router = useRouter();

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

  useEffect(() => {
    if (!params.id) return;

    const id = parseInt(params.id);
    db.select()
      .from(AccountsSchema)
      .where(eq(AccountsSchema.id, id))
      .then(([result]) => {
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

      const id = parseInt(params.id);
      const response = await db
        .update(AccountsSchema)
        .set({
          notes: notes,
          name: nickName,
          balance,
        })
        .where(eq(AccountsSchema.id, id));

      // console.log("response", { response: (await response).lastInsertRowId });
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
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Edit Account",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Text style={styles.sectionTitle}>Account information </Text>

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
      <Text style={styles.sectionTitle}>Today's Balance </Text>

      <View style={styles.row}>
        <BalanceField onChangeText={handleChangeText} value={balance} />
        <Text style={styles.info}>
          An adjustment transaction will be created automatically if you change
          this amount.{" "}
        </Text>
      </View>

      <View style={[styles.row, { marginTop: 32 }]}>
        <CardButton title="Save Account" type="primary" onPress={addAccount} />
      </View>
      <View style={styles.row}>
        <CardButton title="Close Account" type="destructive" />
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    fontFamily: "NunitoSansSemiBold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "LatoRegular",
  },
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
  row: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  info: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: "NunitoSansLight",
  },
});
