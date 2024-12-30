import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const BlinkingCaret = () => {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0, { duration: 500 }),
      -1, // Infinite repetitions
      true // Reverse the animation direction
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.caret, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    // fontSize: 24,
    // fontFamily: "Arial",
    // flexDirection: "row",
    // alignItems: "center",
  },
  caret: {
    width: 2,
    height: 14,
    backgroundColor: "#FFF",
  },
});
