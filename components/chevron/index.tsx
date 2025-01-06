import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ChevronAccordion = ({ isOpen }: { isOpen: boolean }) => {
  const rotation = useSharedValue(1); // Start rotation value (0 = closed)

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 0 : 1, { duration: 100 }); // Smoothly animate rotation
  }, [isOpen, rotation]);

  // Chevron rotation animation
  const chevronStyle = useAnimatedStyle(() => {
    const rotateZ = `${interpolate(rotation.value, [0, 1], [180, 360])}deg`; // Interpolates from 180 to 360
    return { transform: [{ rotateZ: rotateZ }] };
  });

  return (
    <Animated.View style={[chevronStyle]}>
      <FontAwesome name="chevron-down" color={"#ccc"} size={16} />
    </Animated.View>
  );
};

export { ChevronAccordion };

const styles = StyleSheet.create({});
