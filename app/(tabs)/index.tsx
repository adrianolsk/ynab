import {
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SectionList,
  Pressable,
  StatusBar,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View, ViewContent } from "@/components/Themed";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "../../database/schemas/user-schema";
import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/database/db";
import { eq, isNull } from "drizzle-orm";
import ScreenView from "@/components/screen-view";
import { formatCurrency } from "@/utils/financials";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AssignMoneyCard } from "@/components/assign-money-card";
import { AccountGroup } from "@/database/types";
import { AccountType } from "@/types";

type AccountItem = {
  name: string;
  type: AccountType;
};

type SectionItem = {
  title: string;
  accountGroup: "budget" | "loan" | "tracking";
  data: AccountItem[];
};

const DATA: SectionItem[] = [
  {
    title: "Budget Accounts",
    accountGroup: "budget",
    data: [
      {
        name: "Checking",
        type: "checking",
      },
      {
        name: "Savings",
        type: "savings",
      },
      {
        name: "Cash",
        type: "cash",
      },
      {
        name: "Credit Card",
        type: "credit_card",
      },
      {
        name: "Line of Credit",
        type: "line_of_credit",
      },
    ],
  },
  {
    title: "Mortgage and Loans",
    accountGroup: "loan",
    data: [
      {
        name: "Mortgage",
        type: "mortgage",
      },
      {
        name: "Auto Loan",
        type: "auto_loan",
      },
      {
        name: "Student Loan",
        type: "student_loan",
      },
      {
        name: "Personal Loan",
        type: "personal_loan",
      },
      {
        name: "Medical Debt",
        type: "medical_debt",
      },
      {
        name: "Other Debt",
        type: "other_debt",
      },
    ],
  },
  {
    title: "Tracking Accounts",
    accountGroup: "tracking",
    data: [
      {
        name: "Asset",
        type: "asset",
      },
      {
        name: "Liability",
        type: "liability",
      },
    ],
  },
];

export default function BudgetScreen() {
  // const { data } = useLiveQuery(
  //   db.select().from(schema.users).where(isNull(schema.users.deleted_at))
  // );
  const [collapsedSections, setCollapsedSections] = useState({});
  const value = 1000;

  const onAssign = () => {
    console.log("🍎 Assign");
  };
  const onFix = () => {
    console.log("🍎 Fix");
  };

  const toggleSection = (title: string) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const select = (item: AccountItem, accountGroup: AccountGroup) => {};
  return (
    <View style={{ flex: 1 }}>
      <AssignMoneyCard value={value} />
      <SectionList
        stickySectionHeadersEnabled={false}
        style={styles.section}
        // sections={DATA}
        sections={DATA.map((section) => ({
          ...section,
          data: collapsedSections[section.title] ? [] : section.data,
        }))}
        keyExtractor={(item, index) => item.type + index}
        renderItem={({ item, section: { accountGroup } }) => (
          <Pressable
            // style={styles.item}
            onPress={() => select(item, accountGroup)}
          >
            <ViewContent style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
            </ViewContent>
          </Pressable>
        )}
        // renderSectionHeader={({ section: { title } }) => {
        //   return title ? <Text style={styles.header}>{title}</Text> : null;
        // }}
        renderSectionHeader={({ section: { title } }) => (
          <TouchableOpacity
            style={styles.header}
            onPress={() => toggleSection(title)}
          >
            <Text style={styles.header}>{title}</Text>
            <Text>{collapsedSections[title] ? "+" : "-"}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  item: {
    // backgroundColor: "#ffffff",
    padding: 20,
    // borderBottomWidth: 1,
    marginBottom: 1,
    borderBottomColor: "#ccc",
    // marginVertical: 8,
  },
  header: {
    marginVertical: 8,
    // alignSelf: "flex-start",
    fontSize: 14,
    marginTop: 16,
    // borderWidth: 1,
    // backgroundColor: "#fff",
  },
  title: {
    fontSize: 14,
  },
});
