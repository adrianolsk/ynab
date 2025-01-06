import {
  SectionList,
  SectionListData,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AssignMoneyCard } from "@/components/assign-money-card";
import { Text, useThemeColor, View } from "@/components/Themed";

import { NumericKeyboard } from "@/components/numeric-keyboard";
import { db } from "@/database/db";
import {
  CategoryGroupSchema,
  CategoryGroupSchemaType,
} from "@/database/schemas/category-group.schema";
import {
  CategorySchema,
  CategorySchemaType,
} from "@/database/schemas/category.schema";
import { formatCurrency, parseCurrencyToDecimal } from "@/utils/financials";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import CategoryCard from "@/components/category-card";
import { MonthlyAllocationsSchema } from "@/database/schemas/montly-allocation.schema";
import { updateReadyToAssign } from "@/database/services/ready-to-assign.service";
import { uuidV4 } from "@/utils/helpers";
import { Stack, useRouter } from "expo-router";
import { MonthModal } from "@/components/mont-modal";
import { Pressable } from "react-native-gesture-handler";
import { formatWithLocale } from "@/utils/dates";
import { FONT_FAMILIES } from "@/utils/constants";

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
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "yyyy-MM")
  );

  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const [currentAllocatedAmount, setCurrentAllocatedAmount] =
    useState<number>(0);
  const [editedItems, setEditedItems] = useState<ItemMap>({});
  const [collapsedSections, setCollapsedSections] = useState<Map>({});

  const toggleSection = useCallback((title: string) => {
    setCollapsedSections((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  }, []);

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
  }, [bottomSheetHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: bottomSheetHeight.value,
  }));

  const scrolltoindex = useCallback(
    (sectionIndex: number, itemIndex: number) => {
      sectionListRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex,
        viewPosition: 0.1,
      });
    },
    [sectionListRef]
  );

  const saveAllocation = useCallback(async () => {
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
      await db
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
  }, [activeItem, editedItems, currentAllocatedAmount]);

  const handleOpenKeyboard = useCallback(
    async (sectionIndex: number, itemIndex: number) => {
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
    },
    [
      handlePress,
      saveAllocation,
      activeItem?.section,
      activeItem?.index,
      bottomSheetHeight,
      closeBottomSheet,
      handleClosePress,
      SECTIONS,
      scrolltoindex,
    ]
  );

  const backgroundColor = useThemeColor({}, "backgroundContent");

  const renderSectionHeader = useCallback(
    ({
      section: { title },
    }: {
      section: SectionListData<CategorySchemaType, SectionType>;
    }) => {
      return (
        <Header
          closed={!!collapsedSections[title]}
          title={title}
          onPress={() => toggleSection(title)}
        />
      );
    },
    [collapsedSections, toggleSection]
  );

  const onKeyboardKeyPress = useCallback(
    async function (value: string) {
      const key = activeItem!.item.uuid;
      const lastValue = editedItems[activeItem!.item.uuid] ?? "";
      const newValue = lastValue + value;
      setEditedItems((items) => {
        return {
          ...items,
          [key]: newValue,
        };
      });
    },
    [activeItem, editedItems, setEditedItems]
  );

  const onKeyboardCancelPress = useCallback(() => {
    console.log("aqui");
    setCurrentAllocatedAmount(0);
    setIsOpen(false);
    setEditedItems({});
    handleClosePress();
    closeBottomSheet();
  }, [handleClosePress, closeBottomSheet]);

  const onKeyboardBackspacePress = useCallback(() => {
    setEditedItems((items) => {
      const key = activeItem!.item.uuid;
      const lastValue =
        items[activeItem!.item.uuid] ?? formatCurrency(currentAllocatedAmount);

      const newValue = lastValue.slice(0, -1);
      return {
        ...items,
        [key]: newValue,
      };
    });
  }, [activeItem, currentAllocatedAmount, setEditedItems]);

  const onKeyboardConfirmPress = useCallback(async () => {
    await saveAllocation();
    setIsOpen(false);
    setEditedItems({});
    handleClosePress();
    closeBottomSheet();
  }, [saveAllocation, handleClosePress, closeBottomSheet]);

  const onEdit = useCallback(() => {
    onKeyboardCancelPress();
    router.push({
      pathname: "/category-detail",
      params: {
        categoryUuid: activeItem?.item.uuid,
        month: currentMonth,
      },
    });
  }, [activeItem?.item.uuid, currentMonth, onKeyboardCancelPress, router]);

  const renderHeaderTitle = useCallback(() => {
    return (
      <Pressable
        onPress={() => setIsVisible(true)}
        style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
      >
        <Text style={{ textTransform: "capitalize" }}>
          {formatWithLocale(currentMonth, "MMMM yyyy")}
        </Text>
        <FontAwesome name="arrow-circle-o-down" size={20} color="#3F69DC" />
      </Pressable>
    );
  }, [currentMonth]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: renderHeaderTitle,
        }}
      />
      <AssignMoneyCard />

      <SectionList<CategorySchemaType, SectionType>
        ref={sectionListRef}
        stickySectionHeadersEnabled={false}
        sections={SECTIONS}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item, index, section }) => {
          const sectionIndex = SECTIONS.indexOf(section);
          const isSelected =
            activeItem?.section === sectionIndex && activeItem?.index === index;

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
              currentMonth={currentMonth}
              currentEditedAmount={editedItems[item.uuid]}
            />
          );
        }}
        renderSectionHeader={renderSectionHeader}
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
        // detached
      >
        <BottomSheetView style={{ padding: 16 }}>
          <NumericKeyboard
            onCancel={onKeyboardCancelPress}
            onPress={onKeyboardKeyPress}
            onBackspace={onKeyboardBackspacePress}
            onConfirm={onKeyboardConfirmPress}
            onEdit={onEdit}
          />
        </BottomSheetView>
      </BottomSheetModal>

      <MonthModal
        onChange={setCurrentMonth}
        isVisible={isVisible}
        onDismiss={() => setIsVisible(false)}
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
    fontFamily: FONT_FAMILIES.Medium,
  },
  availableText: {
    fontSize: 12,
    fontFamily: FONT_FAMILIES.Medium,
    color: "#aaa",
  },
});
