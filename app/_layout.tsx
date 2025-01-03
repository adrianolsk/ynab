import SeedDatabase from "@/components/seed-database";
import { Text } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import { DarkTheme } from "@/constants/DarkTheme";
import { LightTheme } from "@/constants/LightTheme";
import { DATABASE_NAME, db } from "@/database/db";
import "@/i18n";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  // DarkTheme,
  // DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-get-random-values";
import "react-native-reanimated";
import migrations from "../drizzle/migrations";
import * as SystemUI from "expo-system-ui";
// DATABASE
import * as SQLite from "expo-sqlite";
const actualDatabse = SQLite.openDatabaseSync(DATABASE_NAME);
// DATABASE
SystemUI.setBackgroundColorAsync("black");
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
              contentStyle: {
                // backgroundColor: "red",
              },
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
