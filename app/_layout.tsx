import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  // DarkTheme,
  // DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "@/i18n";
import { useColorScheme } from "@/components/useColorScheme";
import "react-native-get-random-values";
import { DATABASE_NAME, db } from "@/database/db";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Platform, View } from "react-native";
import migrations from "../drizzle/migrations";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { StatusBar } from "expo-status-bar";
import { LightTheme } from "@/constants/LightTheme";
import { DarkTheme } from "@/constants/DarkTheme";
import { useDatabaseSeed } from "@/hooks/use-database-seed.hook";
import SeedDatabase from "@/components/seed-database";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Text } from "@/components/Themed";
// DATABASE
import * as SQLite from "expo-sqlite";
const actualDatabse = SQLite.openDatabaseSync(DATABASE_NAME);
// DATABASE

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useDrizzleStudio(actualDatabse);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    LatoBlack: require("../assets/fonts/Lato-Black.ttf"),
    LatoBold: require("../assets/fonts/Lato-Bold.ttf"),
    LatoRegular: require("../assets/fonts/Lato-Regular.ttf"),
    LatoThin: require("../assets/fonts/Lato-Thin.ttf"),
    Light: require("../assets/fonts/Lato-Light.ttf"),
    NunitoSansBold: require("../assets/fonts/NunitoSans-Bold.ttf"),
    NunitoSansRegular: require("../assets/fonts/NunitoSans-Regular.ttf"),
    NunitoSansSemiBold: require("../assets/fonts/NunitoSans-SemiBold.ttf"),
    NunitoSansMedium: require("../assets/fonts/NunitoSans-Medium.ttf"),
    NunitoSansLight: require("../assets/fonts/NunitoSans-Light.ttf"),
    NunitoSans: require("../assets/fonts/NunitoSans.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  // useDrizzleStudio(db);

  if (error) {
    return (
      <View style={{ flex: 1, paddingTop: 100 }}>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <StatusBar style="auto" />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : LightTheme}>
        <SeedDatabase />
        <BottomSheetModalProvider>
          <Stack
            screenOptions={{
              headerTitleStyle: {
                fontFamily: "NunitoSansSemiBold",
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ title: "Select Account Type", presentation: "modal" }}
            />
            <Stack.Screen
              name="category.modal"
              options={{ presentation: "card" }}
            />
            {/* <Stack.Screen
          name="accounts/edit/[id]"
          options={{ presentation: "formSheet" }}
        /> */}
          </Stack>
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
