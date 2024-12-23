import { Button, StyleSheet, ScrollView } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "../../database/schemas/user.schema";
import { useEffect } from "react";
import { db } from "@/database/db";
import { eq, isNull } from "drizzle-orm";

export default function TabTwoScreen() {
  return null;
}
