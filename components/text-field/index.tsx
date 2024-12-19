import React, { useEffect, useState } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export const TextField = ({ placeholder, style, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useSharedValue(!!props.value ? 0 : 1);

  const handleFocus = () => {
    setIsFocused(true);
    labelPosition.value = 1; // Move label up
  };

  const handleBlur = () => {
    if (!props.value) {
      setIsFocused(false);
      labelPosition.value = 0; // Move label back down
    }
  };

  useEffect(() => {
    console.log("isFocused", isFocused);
    console.log("props.value", props.value?.length);
    if (!isFocused && props.value?.length === 0) {
      labelPosition.value = 0;
    } else {
      labelPosition.value = 1;
    }
  }, [isFocused, props.value]);

  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(labelPosition.value ? -10 : 10, {
            duration: 200,
            easing: Easing.out(Easing.ease),
          }),
        },
      ],
      fontSize: withTiming(labelPosition.value ? 12 : 14, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      }),
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={[styles.label, animatedLabelStyle]}>
        {placeholder}
      </Animated.Text>
      <TextInput
        {...props}
        style={styles.textInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 16,
    marginBottom: 0,
  },
  label: {
    position: "absolute",
    left: 0,
    color: "gray",
  },
  textInput: {
    height: 40,
    // borderBottomWidth: 1,
    // borderBottomColor: "gray",
    fontSize: 14,
    // paddingVertical: 5,
    marginBottom: 8,
  },
});
