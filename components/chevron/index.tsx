import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { mix } from "react-native-redash";

const ChevronAccordion = ({ isOpen }: { isOpen: boolean }) => {
  const rotation = useSharedValue(1); // Start rotation value (0 = closed)

  useEffect(() => {
    rotation.value = withTiming(isOpen ? 0 : 1, { duration: 300 }); // Smoothly animate rotation
  }, [isOpen, rotation]);

  // Chevron rotation animation
  const chevronStyle = useAnimatedStyle(() => {
    const rotateZ = `${mix(rotation.value, 180, 360)}deg`; // 0 to 180 degrees
    return { transform: [{ rotateZ }] };
  });

  return (
    <Animated.View style={[styles.chevron, chevronStyle]}>
      <FontAwesome name="chevron-down" color={"#ccc"} size={16} />
    </Animated.View>
  );
};

export { ChevronAccordion };

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ddd",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chevron: {
    marginLeft: 8,
  },

  content: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
});
