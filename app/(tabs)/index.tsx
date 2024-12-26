import {
  SectionList,
  SectionListProps,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { AssignMoneyCard } from "@/components/assign-money-card";
import { Text, useThemeColor, View, ViewContent } from "@/components/Themed";

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
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";
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
import { format, set } from "date-fns";
import { Pressable } from "react-native-gesture-handler";
import CategoryCard from "@/components/category-card";
import { MonthlyAllocationsSchema } from "@/database/schemas/montly-allocation.schema";
import { uuidV4 } from "@/utils/helpers";

const AnimatedSectionList =
  Animated.createAnimatedComponent<SectionListProps<AccountItem, SectionType>>(
    SectionList
  );
type AccountItem = {
  name: string;
  // type: AccountType;
  target: number | null | undefined;
  alocated: number | null | undefined;
  uuid: string;
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

interface ItemMap {
  [key: string]: string;
}

interface SectionType {
  title: string;
  // accountGroup: "budget" | "loan" | "tracking";
  data: CategorySchemaType[];
}

export default function BudgetScreen() {
  const [activeRow, setActiveRow] = useState<number | null | undefined>();
  const [editedItems, setEditedItems] = useState<ItemMap>({});
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
        // data: categories.map((category) => ({
        //   name: category.name, // Category name
        //   target: category.target_amount,
        //   alocated: category.allocated_amount,
        //   uuid: category.uuid,
        //   // type: category.is_income ? "income" : "expense", // Example logic for type
        // })),
        data: categories,
      };
    });

    return ledote;
  }, [liveData]);

  const select = (item: AccountItem, accountGroup: AccountGroup) => {};

  const SECTIONS = leData.map<SectionType>((section) => ({
    ...section,
    data: collapsedSections[section.title] ? [] : section.data,
  }));

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
    setActiveItem(null);
    bottomSheetRef.current?.close();
  }, []);

  // const sectionListRef = useRef<SectionList<AccountType, SectionType>>(null);
  // const sectionListRef = useRef<SectionList<AccountType, SectionType>>(null);

  const [inputValue, setInputValue] = useState("");
  const [activeItem, setActiveItem] = useState<{
    section: number;
    index: number;
    item: CategorySchemaType;
  } | null>(null);

  const sectionListRef =
    useRef<SectionList<CategorySchemaType, SectionType>>(null);

  const bottomSheetHeight = useSharedValue(0);
  const [isOpen, setIsOpen] = useState(false);
  // const [selectedAlocated, setSelectedAlocated] = useState<string>("");
  const handlePress = useCallback(() => {
    setIsOpen(true);

    // bottomSheetHeight.value = withTiming(200, { duration: 100 }); // Animate to 300px height
  }, []);

  const closeBottomSheet = useCallback(() => {
    setIsOpen(false);
    bottomSheetHeight.value = withTiming(0, { duration: 100 }); // Animate back to 0 height
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

    if (
      activeItem?.section === sectionIndex &&
      activeItem?.index === itemIndex
    ) {
      closeBottomSheet();
      setActiveItem(null);
      handleClosePress();
      return;
    } else {
      setActiveItem({
        section: sectionIndex,
        index: itemIndex,
        item: SECTIONS[sectionIndex].data[itemIndex],
      });
    }
    bottomSheetRef.current?.present();

    bottomSheetHeight.value = withTiming(240, { duration: 300 }, () => {
      runOnJS(scrolltoindex)(sectionIndex, itemIndex);
    });
  };

  const backgroundColor = useThemeColor({}, "backgroundContent");
  return (
    <View style={{ flex: 1 }}>
      <AssignMoneyCard value={value} />

      <SectionList<CategorySchemaType, SectionType>
        ref={sectionListRef}
        stickySectionHeadersEnabled={false}
        sections={SECTIONS}
        // style={[styles.section]}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item, index, section }) => {
          // debugger;
          const sectionIndex = SECTIONS.indexOf(section);
          const isSelected =
            activeItem?.section === sectionIndex && activeItem?.index === index;
          const selectedStyle = isSelected ? styles.selected : {};

          return (
            <CategoryCard
              item={item}
              uuid={item.uuid}
              isSelected={isSelected}
              onPress={() => {
                setActiveRow(item.allocated_amount);
                handleOpenKeyboard(SECTIONS.indexOf(section), index);
              }}
              isOpen={isOpen}
            />
          );
          return (
            <Pressable
              onPress={() => {
                setActiveRow(item.allocated_amount);
                handleOpenKeyboard(SECTIONS.indexOf(section), index);
              }}
            >
              <ViewContent style={[styles.item, selectedStyle]}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.title}>{item.name}</Text>
                </View>
                <View>
                  {isOpen && (
                    <Text style={styles.title}>
                      {editedItems[item.uuid]
                        ? formatCurrency(
                            parseCurrencyToDecimal(editedItems[item.uuid])
                          )
                        : formatCurrency(item.allocated_amount ?? 0)}
                    </Text>
                  )}
                </View>
                <View style={{ width: 120, alignItems: "flex-end" }}>
                  <Text style={styles.title}>
                    {formatCurrency(item.target_amount ?? 0)}
                  </Text>
                </View>
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
        ListFooterComponent={() => (
          <Animated.View
            style={[
              // {
              //   shadowOffset: { width: 0, height: -2 },
              //   shadowOpacity: 0.5,
              //   shadowRadius: 2,
              // },
              animatedStyle,
            ]}
          />
        )}
      />

      <BottomSheetModal
        enableContentPanningGesture={false}
        handleComponent={() => null}
        handleStyle={{
          backgroundColor: backgroundColor,
        }}
        onDismiss={closeBottomSheet}
        ref={bottomSheetRef}
        backgroundStyle={{
          backgroundColor: backgroundColor,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
        }}
        detached
      >
        <BottomSheetView style={{ padding: 16 }}>
          <NumericKeyboard
            onCancel={async () => {
              const key = activeItem!.item.uuid;
              // await db
              //   .update(CategorySchema)
              //   .set({
              //     allocated_amount: activeRow,
              //     updated_at: new Date().toISOString(),
              //   })
              //   .where(eq(CategorySchema.uuid, key));
              // await db
              //   .update(MonthlyAllocationsSchema)
              //   .set({
              //     allocated_amount: activeRow,
              //     updated_at: new Date().toISOString(),
              //   })
              //   .where(eq(CategorySchema.uuid, key));
              console.log("🍎 result", { result: key });
              const result = await db
                .insert(MonthlyAllocationsSchema)
                .values({
                  uuid: uuidV4(),
                  budget_uuid: activeItem!.item.budget_uuid,
                  category_uuid: key,
                  month: format(new Date(), "yyyy-MM"),
                  allocated_amount: activeRow ?? 0,
                })
                .onConflictDoUpdate({
                  target: [
                    MonthlyAllocationsSchema.category_uuid,
                    MonthlyAllocationsSchema.month,
                  ], // Columns that define the conflict
                  set: { allocated_amount: activeRow ?? 0 }, // What to update
                });
              console.log("🍎 result", { result: result.lastInsertRowId });
              setActiveRow(undefined);
              setIsOpen(false);
              setEditedItems({});
              handleClosePress();
              closeBottomSheet();
            }}
            onPress={async function (value: string) {
              const key = activeItem!.item.uuid;
              const lastValue = editedItems[activeItem!.item.uuid] ?? "";
              const newValue = lastValue + value;
              setEditedItems((items) => {
                return {
                  ...items,
                  [key]: newValue,
                };
              });

              // await db
              //   .update(CategorySchema)
              //   .set({
              //     allocated_amount: parseCurrencyToDecimal(newValue),
              //     target_amount: parseCurrencyToDecimal(newValue),
              //     updated_at: new Date().toISOString(),
              //   })
              //   .where(eq(CategorySchema.uuid, key));
              // setSelectedAlocated((v) => v + value);
              console.log("🍎 result", { newValue: newValue });
              try {
                const result = await db
                  .insert(MonthlyAllocationsSchema)
                  .values({
                    uuid: uuidV4(),
                    budget_uuid: activeItem!.item.budget_uuid,
                    category_uuid: key,
                    month: format(new Date(), "yyyy-MM"),
                    allocated_amount: parseCurrencyToDecimal(newValue),
                  })
                  .onConflictDoUpdate({
                    target: [
                      MonthlyAllocationsSchema.category_uuid,
                      MonthlyAllocationsSchema.month,
                    ], // Columns that define the conflict
                    set: { allocated_amount: parseCurrencyToDecimal(newValue) }, // What to update
                  });
                console.log("🍎 result", { result: result.lastInsertRowId });
              } catch (error) {
                console.log("🍎 error", { error: error });
              }
            }}
            onBackspace={function (): void {
              setEditedItems((items) => {
                const key = activeItem!.item.uuid;
                const lastValue = items[activeItem!.item.uuid] ?? "";
                const newValue = lastValue.slice(0, -1);
                return {
                  ...items,
                  [key]: newValue,
                };
              });
              // setSelectedAlocated((v) => v.slice(0, -1));
            }}
            onConfirm={async function () {
              setIsOpen(false);
              setEditedItems({});
              handleClosePress();
              closeBottomSheet();
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
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
  selected: {
    backgroundColor: "#233883",
  },
  section: {
    padding: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 12,
    fontFamily: "NunitoSansMedium",
  },
});
