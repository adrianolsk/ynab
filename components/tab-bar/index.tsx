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

  return (
    <ViewContent
      style={{
        flexDirection: "row",
        height: StatusBar.currentHeight,
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        // shadowColor: "#555",

        paddingTop: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title;

        const isFocused = state.index === index;

        const onPress = () => {
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

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={index}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <ViewContent
              style={{
                paddingTop: 4,
                alignItems: "center",
              }}
            >
              <TabBarIcon
                name={ROUTE_ICONS[route.name]}
                color={isFocused ? tabIconSelected : tabIconDefault}
              />

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  fontFamily: "NunitoSansLight",
                  color: isFocused ? tabIconSelected : tabIconDefault,
                }}
              >
                {label}
              </Text>
            </ViewContent>
          </PlatformPressable>
        );
      })}
    </ViewContent>
  );
};
