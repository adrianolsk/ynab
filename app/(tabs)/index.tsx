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
import React, { useEffect, useMemo, useState } from "react";
import {
  CategoryGroupSchema,
  CategoryGroupSchemaType,
} from "@/database/schemas/category-group.schema";
import { db } from "@/database/db";
import { eq } from "drizzle-orm";
import {
  CategorySchema,
  CategorySchemaType,
} from "@/database/schemas/category.schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { formatCurrency } from "@/utils/financials";

type AccountItem = {
  name: string;
  type: AccountType;
};

type SectionItem = {
  title: string;
  accountGroup: "budget" | "loan" | "tracking";
  data: AccountItem[];
};

// const DATA: SectionItem[] = [
//   {
//     title: "Budget Accounts",
//     accountGroup: "budget",
//     data: [
//       {
//         name: "Checking",
//         type: "checking",
//       },
//       {
//         name: "Savings",
//         type: "savings",
//       },
//       {
//         name: "Cash",
//         type: "cash",
//       },
//       {
//         name: "Credit Card",
//         type: "credit_card",
//       },
//       {
//         name: "Line of Credit",
//         type: "line_of_credit",
//       },
//     ],
//   },
//   {
//     title: "Mortgage and Loans",
//     accountGroup: "loan",
//     data: [
//       {
//         name: "Mortgage",
//         type: "mortgage",
//       },
//       {
//         name: "Auto Loan",
//         type: "auto_loan",
//       },
//       {
//         name: "Student Loan",
//         type: "student_loan",
//       },
//       {
//         name: "Personal Loan",
//         type: "personal_loan",
//       },
//       {
//         name: "Medical Debt",
//         type: "medical_debt",
//       },
//       {
//         name: "Other Debt",
//         type: "other_debt",
//       },
//     ],
//   },
//   {
//     title: "Tracking Accounts",
//     accountGroup: "tracking",
//     data: [
//       {
//         name: "Asset",
//         type: "asset",
//       },
//       {
//         name: "Liability",
//         type: "liability",
//       },
//     ],
//   },
// ];

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

  const { data: liveData } = useLiveQuery(
    db
      .select({
        category: CategorySchema,
        group: CategoryGroupSchema,
      })
      .from(CategorySchema)
      .innerJoin(
        CategoryGroupSchema,
        eq(CategoryGroupSchema.uuid, CategorySchema.category_group_uuid)
      )
  );

  const leData = useMemo(() => {
    if (!liveData) return [];
    const result = liveData.reduce<
      Record<
        number,
        {
          group: CategoryGroupSchemaType;
          categories: CategorySchemaType[];
        }
      >
    >((acc, row) => {
      const group = row.group;
      const category = row.category;
      if (!acc[group.id]) {
        acc[group.id] = { group, categories: [] };
      }
      if (category) {
        acc[group.id].categories.push(category);
      }
      return acc;
    }, {});

    const ledote = Object.values(result).map(({ group, categories }) => {
      return {
        title: group.name, // Use the category group name as the title
        accountGroup: group.uuid, // Or another property to identify the group
        data: categories.map((category) => ({
          name: category.name, // Category name
          target: category.target_amount,
          // type: category.is_income ? "income" : "expense", // Example logic for type
        })),
      };
    });

    console.log("🍎 leData", JSON.stringify(ledote, null, 2));

    return ledote;
  }, [liveData]);

  const select = (item: AccountItem, accountGroup: AccountGroup) => {};
  return (
    <View style={{ flex: 1 }}>
      <AssignMoneyCard value={value} />
      <SectionList
        stickySectionHeadersEnabled={false}
        style={styles.section}
        sections={leData.map((section) => ({
          ...section,
          data: collapsedSections[section.title] ? [] : section.data,
        }))}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item, section: { accountGroup } }) => (
          <Pressable onPress={() => select(item, accountGroup)}>
            <ViewContent style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.name}</Text>
              </View>
              <Text style={styles.title}>
                {formatCurrency(item.target ?? 0)}
              </Text>
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
    flexDirection: "row",
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
