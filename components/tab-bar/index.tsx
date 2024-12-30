import { View, Platform, StatusBar } from "react-native";
import { useLinkBuilder, useRoute, useTheme } from "@react-navigation/native";
import { PlatformPressable } from "@react-navigation/elements";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColor, ViewContent } from "../Themed";
import { Text } from "@/components/Themed";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native-gesture-handler";
import { TabBarButton } from "./tab-bar-button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

type Icon = React.ComponentProps<typeof FontAwesome>["name"];
type Route = "index" | "accounts" | "transaction" | "report" | "help";
const ROUTE_ICONS: Record<string, Icon> = {
  index: "dollar",
  accounts: "bank",
  transaction: "plus-circle",
  report: "address-book",
  help: "question",
};

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { colors } = useTheme();
  const router = useRouter();
  const tabIconDefault = useThemeColor({}, "tabIconDefault");
  const tabIconSelected = useThemeColor({}, "tabIconSelected");
  const { buildHref } = useLinkBuilder();
  const insets = useSafeAreaInsets();

  return (
    <ViewContent
      style={{
        borderTopWidth: 1,
        borderTopColor: "#222",
        flexDirection: "row",
        // height: 90,
        // height: 100 - insets.bottom,
        // height: StatusBar.currentHeight,
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        // shadowColor: "#006699",
        // shadowColor: "#555",

        paddingTop: 8,
        // paddingBottom: insets.bottom,
        // backgroundColor: "red",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? "";

        const isFocused = state.index === index;

        const onPress = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          console.log("onPress", { route });
          if (route.name === "transaction") {
            router.push("/transaction/new");
          } else {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }
        };

        return (
          <TabBarButton
            key={index}
            onPress={onPress}
            isFocused={isFocused}
            label={label}
            route={route}
            options={options}
            index={index}
          />
        );
      })}
    </ViewContent>
  );
};
