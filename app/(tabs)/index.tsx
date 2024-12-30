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
import { updateReadyToAssign } from "@/database/services/ready-to-assign.service";

type AccountItem = {
  name: string;
  target: number | null | undefined;
  alocated: number | null | undefined;
  uuid: string;
};

type SectionItem = {
  title: string;
  accountGroup: AccountGroup;
  data: AccountItem[];
};

interface Map {
  [key: string]: boolean | undefined;
}

interface ItemMap {
  [key: string]: string;
}

interface SectionType {
  title: string;
  data: CategorySchemaType[];
}

export default function BudgetScreen() {
  const [currentAllocatedAmount, setCurrentAllocatedAmount] =
    useState<number>(0);
  const [editedItems, setEditedItems] = useState<ItemMap>({});
  const [collapsedSections, setCollapsedSections] = useState<Map>({});

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
  const sectionData = useMemo((): SectionType[] => {
    if (!liveData) return [];

    // Use a Map to group categories by their group ID
    const groupMap = new Map<
      number,
      { group: CategoryGroupSchemaType; categories: CategorySchemaType[] }
    >();

    for (const { group, category } of liveData) {
      if (!groupMap.has(group.id)) {
        groupMap.set(group.id, { group, categories: [] });
      }

      if (category) {
        groupMap.get(group.id)!.categories.push(category); // `!` is safe due to the previous check
      }
    }

    // Convert the Map to an array of sections
    return Array.from(groupMap.values()).map(({ group, categories }) => ({
      title: group.name,
      data: categories,
    }));
  }, [liveData]);

  // Adjust sections based on collapsed state
  const SECTIONS = useMemo((): SectionType[] => {
    return sectionData.map((section) => ({
      ...section,
      data: collapsedSections[section.title] ? [] : section.data,
    }));
  }, [sectionData, collapsedSections]);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleClosePress = useCallback(() => {
    setActiveItem(null);
    bottomSheetRef.current?.close();
  }, []);

  const [activeItem, setActiveItem] = useState<{
    section: number;
    index: number;
    item: CategorySchemaType;
  } | null>(null);

  const sectionListRef =
    useRef<SectionList<CategorySchemaType, SectionType>>(null);

  const bottomSheetHeight = useSharedValue(0);
  const [isOpen, setIsOpen] = useState(false);

  const handlePress = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setIsOpen(false);
    bottomSheetHeight.value = withTiming(0, { duration: 100 }); // Animate back to 0 height
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: bottomSheetHeight.value,
  }));

  const scrolltoindex = (sectionIndex: number, itemIndex: number) => {
    sectionListRef.current?.scrollToLocation({
      sectionIndex,
      itemIndex,
      viewPosition: 0.1,
    });
  };
  const handleOpenKeyboard = async (
    sectionIndex: number,
    itemIndex: number
  ) => {
    handlePress(); // Set the height of the bottom sheet
    await saveAllocation();

    if (
      activeItem?.section === sectionIndex &&
      activeItem?.index === itemIndex
    ) {
      closeBottomSheet();
      setActiveItem(null);
      setEditedItems({});
      handleClosePress();
      return;
    } else {
      setEditedItems({});
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

  const saveAllocation = async () => {
    if (!editedItems[activeItem?.item?.uuid ?? ""]) return;
    try {
      const key = activeItem!.item.uuid;

      const newValue = parseCurrencyToDecimal(
        editedItems[activeItem!.item.uuid] ?? "0"
      );
      const budget_uuid = activeItem!.item.budget_uuid;
      const month = format(new Date(), "yyyy-MM");
      // const newValue = lastValue + value;

      const valueToDecrease = currentAllocatedAmount - newValue;

      await updateReadyToAssign({
        budget_uuid,
        month,
        value: valueToDecrease,
      });
      const result = await db
        .insert(MonthlyAllocationsSchema)
        .values({
          uuid: uuidV4(),
          budget_uuid: activeItem!.item.budget_uuid,
          category_uuid: key,
          month: format(new Date(), "yyyy-MM"),
          allocated_amount: newValue,
        })
        .onConflictDoUpdate({
          target: [
            MonthlyAllocationsSchema.category_uuid,
            MonthlyAllocationsSchema.month,
            MonthlyAllocationsSchema.budget_uuid,
          ], // Columns that define the conflict
          set: { allocated_amount: newValue }, // What to update
        });
    } catch (error) {
      console.log("🍎 error", { error: error });
    }
  };

  const backgroundColor = useThemeColor({}, "backgroundContent");
  return (
    <View style={{ flex: 1 }}>
      <AssignMoneyCard />

      <SectionList<CategorySchemaType, SectionType>
        ref={sectionListRef}
        stickySectionHeadersEnabled={false}
        sections={SECTIONS}
        // style={[styles.section]}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item, index, section }) => {
          const sectionIndex = SECTIONS.indexOf(section);
          const isSelected =
            activeItem?.section === sectionIndex && activeItem?.index === index;
          const selectedStyle = isSelected ? styles.selected : {};

          return (
            <CategoryCard
              item={item}
              uuid={item.uuid}
              isSelected={isSelected}
              onPress={(currentAllocatedAmount) => {
                setCurrentAllocatedAmount(currentAllocatedAmount);
                handleOpenKeyboard(SECTIONS.indexOf(section), index);
              }}
              isOpen={isOpen}
              currentEditedAmount={editedItems[item.uuid]}
            />
          );
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Header
            closed={!!collapsedSections[title]}
            title={title}
            onPress={() => toggleSection(title)}
          />
        )}
        ListFooterComponent={() => <Animated.View style={[animatedStyle]} />}
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
              setCurrentAllocatedAmount(0);
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
            }}
            onBackspace={function (): void {
              setEditedItems((items) => {
                const key = activeItem!.item.uuid;
                const lastValue =
                  items[activeItem!.item.uuid] ??
                  formatCurrency(currentAllocatedAmount);

                const newValue = lastValue.slice(0, -1);
                return {
                  ...items,
                  [key]: newValue,
                };
              });
            }}
            onConfirm={async function () {
              await saveAllocation();
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
        <FontAwesome
          name={closed ? "chevron-down" : "chevron-up"}
          size={12}
          color="#555"
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View>
          <Text style={styles.availableText}>Available to spend</Text>
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
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontFamily: "NunitoSansMedium",
  },
  availableText: {
    fontSize: 12,
    fontFamily: "NunitoSansMedium",
    color: "#aaa",
  },
});
