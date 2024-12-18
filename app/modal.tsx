// import { StatusBar } from "expo-status-bar";
import {
  Button,
  Platform,
  Pressable,
  SectionList,
  StatusBar,
  StyleSheet,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { AccountGroup } from "@/database/types";

type AccountType =
  | "checking"
  | "savings"
  | "cash"
  | "credit_card"
  | "line_of_credit"
  | "mortgage"
  | "auto_loan"
  | "student_loan"
  | "personal_loan"
  | "medical_debt"
  | "other_debt"
  | "asset"
  | "liability";

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

export default function ModalScreen() {
  const router = useRouter();

  function select(item: AccountItem, accountGroup: AccountGroup) {
    // Return back to the view containing the form
    router.dismissTo({
      pathname: "/accounts/new",
      params: {
        id: item.type,
        accountGroup,
      },
    });
  }

  return (
    <SectionList
      stickySectionHeadersEnabled={false}
      style={styles.section}
      sections={DATA}
      keyExtractor={(item, index) => item.type + index}
      renderItem={({ item, section: { accountGroup } }) => (
        <Pressable
          style={styles.item}
          onPress={() => select(item, accountGroup)}
        >
          <Text style={styles.title}>{item.name}</Text>
        </Pressable>
      )}
      renderSectionHeader={({ section: { title } }) => {
        return title ? <Text style={styles.header}>{title}</Text> : null;
      }}
    />
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
    backgroundColor: "#ffffff",
    padding: 20,
    borderBottomWidth: 1,
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
