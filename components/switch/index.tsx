import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  View,
  StyleSheet,
  Button,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);
// todo: fix types

interface SwitchProps {
  value: SharedValue<boolean>;
  onPress: () => void;
  style?: any;
  duration?: number;
  trackColors?: { on: string; off: string };
  thumbColors?: { on: string; off: string };
  showIcon?: boolean;
  // icon?: keyof typeof FontAwesome.glyphMap;
}
export const Switch = ({
  value,
  onPress,
  style,
  duration = 300,
  trackColors = { on: "#C1EE9F", off: "#FAADA5" },
  thumbColors = { on: "#4D9119", off: "#C72C1E" },
  showIcon = true,
}: SwitchProps) => {
  const [isOn, setIsOn] = useState(false);
  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      value.value ? 1 : 0,
      [0, 1],
      [trackColors.off, trackColors.on]
    );
    const colorValue = withTiming(color, { duration });

    return {
      backgroundColor: colorValue,
      borderRadius: height.value / 2,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      value.value ? 1 : 0,
      [0, 1],
      [thumbColors.off, thumbColors.on]
    );
    const colorValue = withTiming(color, { duration });

    const moveValue = interpolate(
      Number(value.value),
      [0, 1],
      [0, width.value - height.value]
    );
    const translateValue = withTiming(moveValue, { duration });

    return {
      backgroundColor: colorValue,
      transform: [{ translateX: translateValue }],
      borderRadius: height.value / 2,
    };
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      name: value.value ? "plus" : "minus",
    };
  });

  useAnimatedReaction(
    () => value.value,
    (currentValue) => {
      runOnJS(setIsOn)(currentValue);
    }
  );

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
          width.value = e.nativeEvent.layout.width;
        }}
        style={[switchStyles.track, style, trackAnimatedStyle]}
      >
        <Animated.View style={[switchStyles.thumb, thumbAnimatedStyle]}>
          {showIcon && (
            <FontAwesome
              size={10}
              name={isOn ? "plus" : "minus"}
              color="white"
            />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

interface Switch2Props {
  checked?: boolean;
  onPress: (checked: boolean) => void;
  style?: any;
  duration?: number;
  trackColors?: { on: string; off: string };
  thumbColors?: { on: string; off: string };
  showIcon?: boolean;
}
export const Switch2 = ({
  checked = false,
  onPress,
  ...props
}: Switch2Props) => {
  const isOn = useSharedValue(checked);

  const handlePress = () => {
    isOn.value = !isOn.value;
    onPress(!isOn.value);
  };

  useEffect(() => {
    // isOn.value = checked;
  }, [checked]);

  return <Switch value={isOn} onPress={handlePress} {...props} />;
};

const switchStyles = StyleSheet.create({
  track: {
    alignItems: "flex-start",
    width: 48,
    height: 28,

    padding: 5,
  },
  thumb: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "white",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
