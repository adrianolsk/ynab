import React, { useEffect, useState } from "react";
import { StyleSheet, TextInputProps, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Text, TextInput } from "@/components/Themed";
import { Pressable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { Icon } from "@expo/vector-icons/build/createIconSet";

const AnimatedText = Animated.createAnimatedComponent(Text);

interface TextFieldProps extends TextInputProps {
  placeholder: string;
  style?: any;
  value?: string;
  onPress?: () => void;
  icon?: keyof typeof FontAwesome.glyphMap;
}
export const TextField = ({
  placeholder,
  style,
  onPress,
  ...props
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelPosition = useSharedValue(!!props.value ? 0 : 1);

  const handleFocus = () => {
    setIsFocused(true);
    labelPosition.value = 1;
  };

  const handleBlur = () => {
    if (!props.value) {
      setIsFocused(false);
      labelPosition.value = 0;
    }
  };

  useEffect(() => {
    if (!isFocused && !props.value) {
      labelPosition.value = 0;
      return;
    }
    if (!isFocused && props.value?.length === 0) {
      labelPosition.value = 0;
    } else {
      labelPosition.value = 1;
    }
  }, [isFocused, props.value]);

  console.log("🍎 animatedLabelStyle", {
    labelPosition: labelPosition.value,
    placeholder,
    value: props.value,
  });
  const animatedLabelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(labelPosition.value ? -12 : 2, {
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

  const iconName = props.icon ?? "user";
  return (
    <Pressable onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 32, justifyContent: "center" }}>
          <FontAwesome name={iconName} size={20} color="#aaa" />
        </View>
        <View style={[styles.container, style]}>
          <AnimatedText style={[styles.label, animatedLabelStyle]}>
            {placeholder}
          </AnimatedText>
          <View style={styles.textInputContainer}>
            {!onPress ? (
              <TextInput
                {...props}
                style={styles.textInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            ) : (
              <Text style={styles.textOnlyInput}>{props.value}</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
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

    fontFamily: "NunitoSansRegular",
  },
  textInput: {
    height: 40,
    backgroundColor: "transparent",
    fontSize: 14,
    fontFamily: "NunitoSansMedium",
  },
  textOnlyInput: {
    fontSize: 14,
    fontFamily: "NunitoSansMedium",

    marginTop: 8,
  },
  textInputContainer: {
    height: 40,
  },
});
