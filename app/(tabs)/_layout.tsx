import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Pressable } from "react-native";

import { TabBar } from "@/components/tab-bar";
import { ViewContent } from "@/components/Themed";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    changeNavigationBarColor("#0C1722", false);
  }, []);

  return (
    <ViewContent
      style={{
        flex: 1,
        // backgroundColor: "white",
        paddingBottom: insets.bottom,
      }}
    >
      {/* <StatusBar style="light" backgroundColor="blue" /> */}
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // tabBarShowLabel: false,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("screens.budget"),
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="money" color={color} />
            ),
            headerRight: () => (
              <Pressable
                onPress={async () => {
                  i18n.language === "pt-BR"
                    ? i18n.changeLanguage("en-CA")
                    : i18n.changeLanguage("pt-BR");

                  await AsyncStorage.setItem("language", i18n.language);
                  // router.push("/test");
                }}
              >
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="accounts"
          options={{
            title: t("screens.accounts"),
            tabBarIcon: ({ color }) => <TabBarIcon name="bank" color={color} />,
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            title: t("screens.transaction"),
            tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: t("screens.report"),
            tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          }}
        />
        <Tabs.Screen
          // redirect
          name="help"
          options={{
            // href: null,
            title: t("screens.help"),
            tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          }}
        />
      </Tabs>
    </ViewContent>
  );
}
