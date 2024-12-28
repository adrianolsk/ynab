import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  Button,
  Platform,
  SectionList,
  StatusBar,
  StyleSheet,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View, ViewContent } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, Pressable } from "react-native-gesture-handler";
import { AccountType, AccountGroup } from "@/types";

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
    title: "Categories",
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
  const params = useLocalSearchParams<{
    type: "transaction";
  }>();
  console.log("🍎 values", params.type);
  function select(item: AccountItem, accountGroup: AccountGroup) {
    if (params.type === "transaction") {
      router.dismissTo({
        pathname: "/transaction/new",
        params: {
          id: item.type,
        },
      });
    }
  }

  return (
    <>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <ExpoStatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <SectionList
        stickySectionHeadersEnabled={false}
        style={styles.section}
        sections={DATA}
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
        renderSectionHeader={({ section: { title } }) => {
          return title ? <Text style={styles.header}>{title}</Text> : null;
        }}
      />
    </>
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
