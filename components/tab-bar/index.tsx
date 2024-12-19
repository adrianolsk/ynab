import { View, Platform, StatusBar } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColor } from "../Themed";

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
  const tabIconDefault = useThemeColor({}, "tabIconDefault");
  const tabIconSelected = useThemeColor({}, "tabIconSelected");
  const { buildHref } = useLinkBuilder();

  return (
    <View
      style={{
        flexDirection: "row",
        height: StatusBar.currentHeight,
        backgroundColor: "white",
        borderTopColor: "#ccc",
        borderTopWidth: 1,
        paddingTop: 8,
      }}
    >
      {state.routes.map((route, index) => {
        console.log("here", JSON.stringify(route, null, 2));
        const { options } = descriptors[route.key];
        const label = options.title;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
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
            <View
              style={{
                // alignSelf: "center",
                alignItems: "center",
                // justifyContent: "center",
                // alignContent: "center",
                // width: "25%",
                // flexDirection: "column",
                // borderWidth: 1,
              }}
            >
              <TabBarIcon
                name={ROUTE_ICONS[route.name]}
                color={isFocused ? tabIconSelected : tabIconDefault}
              />

              <Text
                style={{
                  marginTop: 8,
                  color: isFocused ? tabIconSelected : tabIconDefault,
                }}
              >
                {label}
              </Text>
            </View>
          </PlatformPressable>
        );
      })}
    </View>
  );
};
