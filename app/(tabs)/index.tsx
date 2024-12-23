import {
  Pressable,
  SectionList,
  SectionListProps,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { AssignMoneyCard } from "@/components/assign-money-card";
import { Text, View, ViewContent } from "@/components/Themed";

import { AccountGroup, AccountType } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  BottomSheetDraggableView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { NumericKeyboard } from "@/components/numeric-keyboard";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedSectionList =
  Animated.createAnimatedComponent<SectionListProps<AccountItem, SectionType>>(
    SectionList
  );
type AccountItem = {
  name: string;
  // type: AccountType;
  target: number | null | undefined;
};

type SectionItem = {
  title: string;
  accountGroup: AccountGroup;
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

interface SectionType {
  title: string;
  // accountGroup: "budget" | "loan" | "tracking";
  data: AccountItem[];
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

  const leData: SectionType[] = useMemo(() => {
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
        // accountGroup: group., // Or another property to identify the group
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

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ["50%"], []);

  // callbacks
  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);
  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  const handleCollapsePress = useCallback(() => {
    bottomSheetRef.current?.collapse();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // const sectionListRef = useRef<SectionList<AccountType, SectionType>>(null);
  // const sectionListRef = useRef<SectionList<AccountType, SectionType>>(null);

  const [inputValue, setInputValue] = useState("");
  const [activeItem, setActiveItem] = useState<{
    section: number;
    index: number;
  } | null>(null);

  const sectionListRef = useRef<SectionList<AccountItem, SectionType>>(null);

  const bottomSheetHeight = useSharedValue(0);

  const handlePress = useCallback(() => {
    console.log("🍎 handlePress");
    bottomSheetHeight.value = withTiming(300, { duration: 300 }); // Animate to 300px height
  }, []);

  const closeBottomSheet = useCallback(() => {
    bottomSheetHeight.value = withTiming(0, { duration: 300 }); // Animate back to 0 height
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    // backgroundColor: "transparent",
    height: bottomSheetHeight.value,
    // marginBottom: , // Link the shared value to marginBottom
  }));

  const scrolltoindex = (sectionIndex: number, itemIndex: number) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex,
      itemIndex,
      viewPosition: 0.1, // Center the item in the viewport
    });
  };
  const handleOpenKeyboard = (sectionIndex: number, itemIndex: number) => {
    handlePress(); // Set the height of the bottom sheet
    console.log("🍎 handleOpenKeyboard", {
      sectionIndex,
      itemIndex,
    });

    if (
      activeItem?.section === sectionIndex &&
      activeItem?.index === itemIndex
    ) {
      closeBottomSheet();
      return;
    } else {
      setActiveItem({ section: sectionIndex, index: itemIndex });
    }
    bottomSheetRef.current?.present();

    bottomSheetHeight.value = withTiming(250, { duration: 100 }, () => {
      runOnJS(scrolltoindex)(sectionIndex, itemIndex);
    });
    // Scroll to the pressed item
    // sectionListRef.current?.scrollToLocation({
    //   sectionIndex,
    //   itemIndex,
    //   viewPosition: 0.1, // Center the item in the viewport
    // });
  };

  const SECTIONS = leData.map<SectionType>((section) => ({
    ...section,
    data: collapsedSections[section.title] ? [] : section.data,
  }));

  return (
    <View style={{ flex: 1 }}>
      <AssignMoneyCard value={value} />

      <SectionList<AccountItem, SectionType>
        ref={sectionListRef}
        stickySectionHeadersEnabled={false}
        // style={styles.section}
        sections={SECTIONS}
        style={[styles.section]}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item, index, section }) => {
          // debugger;
          return (
            <Pressable
              // onPress={() => {
              //   bottomSheetRef.current?.present(item);
              //   // handleSnapPress(0);
              //   console.log("🍎 onPress");
              // }}
              onPress={() =>
                handleOpenKeyboard(SECTIONS.indexOf(section), index)
              }
            >
              <ViewContent style={styles.item}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.name}</Text>
                </View>
                <Text style={styles.title}>
                  {formatCurrency(item.target ?? 0)}
                </Text>
              </ViewContent>
            </Pressable>
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Header
            closed={!!collapsedSections[title]}
            title={title}
            onPress={() => toggleSection(title)}
          />
        )}
      />

      <Animated.View
        style={[
          {
            // justifyContent: "flex-end",
            // backgroundColor: "transparent",
            // borderWidth: 2,
          },
          animatedStyle,
        ]}
      >
        <NumericKeyboard
          onPress={function (value: string): void {
            console.log("🍎 onPress", { value });
          }}
          onBackspace={function (): void {
            console.log("🍎 onBackspace");
          }}
          onConfirm={function (): void {
            console.log("🍎 onConfirm");
          }}
        />
      </Animated.View>
      {/* <BottomSheetModalProvider>
        <BottomSheetModal
          onDismiss={closeBottomSheet}
          ref={bottomSheetRef}
          // snapPoints={snapPoints}
          // enablePanDownToClose

          backgroundStyle={{
        
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
          }}
          detached
      
          onChange={() => {
            console.log("🍎 onChange");
          }}
        >
          <BottomSheetView style={{ padding: 16 }}>
          
            <NumericKeyboard
              onPress={function (value: string): void {
                console.log("🍎 onPress", { value });
              }}
              onBackspace={function (): void {
                console.log("🍎 onBackspace");
              }}
              onConfirm={function (): void {
                console.log("🍎 onConfirm");
              }}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider> */}
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
    // padding: 16,
    // marginBottom: 300,
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
