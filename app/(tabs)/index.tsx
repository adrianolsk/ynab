import {
  Pressable,
  SectionList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { AssignMoneyCard } from "@/components/assign-money-card";
import { Text, View, ViewContent } from "@/components/Themed";

import { AccountGroup, AccountType } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";

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

interface Map {
  [key: string]: boolean | undefined;
}

export default function BudgetScreen() {
  const [collapsedSections, setCollapsedSections] = useState<Map>({});
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
        sections={DATA.map((section) => ({
          ...section,
          data: collapsedSections[section.title] ? [] : section.data,
        }))}
        keyExtractor={(item, index) => item.type + index}
        renderItem={({ item, section: { accountGroup } }) => (
          <Pressable onPress={() => select(item, accountGroup)}>
            <ViewContent style={styles.item}>
              <Text style={styles.title}>{item.name}</Text>
            </ViewContent>
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Header
            closed={!!collapsedSections[title]}
            title={title}
            onPress={() => toggleSection(title)}
          />
        )}
      />
    </View>
  );
}

const Header = ({
  title,
  onPress,
  closed,
}: {
  title: string;
  onPress: () => void;
  closed: boolean;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={{ marginRight: 8 }}>
          <FontAwesome
            name={closed ? "chevron-down" : "chevron-up"}
            size={12}
            color="#555"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
    padding: 20,
    marginBottom: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 14,
  },
});
