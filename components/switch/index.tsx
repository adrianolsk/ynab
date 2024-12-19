import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
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
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);
// todo: fix types
export const Switch = ({
  value,
  onPress,
  style,
  duration = 400,
  trackColors = { on: "#C1EE9F", off: "#FAADA5" },
  thumbColors = { on: "#4D9119", off: "#C72C1E" },
}: any) => {
  const [isOn, setIsOn] = useState(false);
  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      value.value,
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
      value.value,
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
  // console.log("🍎value", value.value);
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
          <FontAwesome size={10} name={isOn ? "plus" : "minus"} color="white" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
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
