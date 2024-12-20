import { Button, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "../../database/schemas/user-schema";
import React, { useEffect, useMemo } from "react";
import { db } from "@/database/db";
import { eq, isNull } from "drizzle-orm";
import ScreenView from "@/components/screen-view";
import { formatCurrency } from "@/utils/financials";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AssignMoneyCard } from "@/components/assign-money-card";

export default function BudgetScreen() {
  // const { data } = useLiveQuery(
  //   db.select().from(schema.users).where(isNull(schema.users.deleted_at))
  // );

  const value = 1000;

  const onAssign = () => {
    console.log("🍎 Assign");
  };
  const onFix = () => {
    console.log("🍎 Fix");
  };
  return (
    <ScreenView>
      <AssignMoneyCard value={value} />
    </ScreenView>
  );
}
