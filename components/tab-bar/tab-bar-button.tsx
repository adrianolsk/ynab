import { Text } from "react-native";
import React, { useEffect } from "react";
import { Pressable } from "react-native-gesture-handler";
import { useThemeColor, ViewContent } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FONT_FAMILIES } from "@/utils/constants";

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Icon = React.ComponentProps<typeof FontAwesome>["name"];
// type Route = "index" | "accounts" | "transaction" | "report" | "help";
const ROUTE_ICONS: Record<string, Icon> = {
  index: "dollar",
  accounts: "bank",
  transaction: "plus-circle",
  report: "address-book",
  help: "question",
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

interface TabBarButtonProps {
  onPress: () => void;
  isFocused: boolean;
  label: string;
  route: any;
  options: any;
  index: number;
}
const TabBarButton = ({
  onPress,
  isFocused,
  label,
  route,
  options,
}: TabBarButtonProps) => {
  const tabIconDefault = useThemeColor({}, "tabIconDefault");
  const tabIconSelected = useThemeColor({}, "tabIconSelected");
  const value = useSharedValue(0);

  useEffect(() => {
    value.value = withTiming(isFocused ? 1 : 0, { duration: 100 });
  }, [isFocused, value]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(value.value, [0, 1], [1, 1.2]);
    const top = interpolate(value.value, [0, 1], [0, 10]);
    return {
      transform: [{ scale }],
      top,
    };
  });
  const animatedOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(value.value, [0, 1], [1, 0]);
    return {
      opacity,
    };
  });

  return (
    <Pressable
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPressIn={onPress}
      style={{ flex: 1 }}
    >
      <Animated.View style={[animatedStyle]}>
        <ViewContent
          //   darkColor="transparent"
          style={{
            paddingTop: 4,
            paddingBottom: 14,
            alignItems: "center",
          }}
        >
          <TabBarIcon
            name={ROUTE_ICONS[route.name]}
            color={isFocused ? tabIconSelected : tabIconDefault}
          />
          <Animated.View style={[animatedOpacity]}>
            <Text
              style={{
                marginTop: 8,
                fontSize: 12,
                fontFamily: FONT_FAMILIES.Light,
                color: isFocused ? tabIconSelected : tabIconDefault,
              }}
            >
              {label}
            </Text>
          </Animated.View>
        </ViewContent>
      </Animated.View>
    </Pressable>
  );
};

export { TabBarButton };
