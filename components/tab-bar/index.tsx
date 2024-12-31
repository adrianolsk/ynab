import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ViewContent } from "../Themed";
import { TabBarButton } from "./tab-bar-button";

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const router = useRouter();

  return (
    <ViewContent
      style={{
        borderTopWidth: 1,
        borderTopColor: "#222",
        flexDirection: "row",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        paddingTop: 8,
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
