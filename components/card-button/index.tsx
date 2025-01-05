import React from "react";
import { ButtonProps, StyleSheet, Text } from "react-native";
import { ViewContent } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native-gesture-handler";
import { FONT_FAMILIES } from "@/utils/constants";

type ButtonType = "primary" | "secondary" | "destructive";

interface CardButtonProps extends ButtonProps {
  onPress?: () => void;
  type?: ButtonType;
  iconLeft?: keyof typeof FontAwesome.glyphMap;
}

export const CardButton = ({
  onPress,
  title,
  type = "primary",
  iconLeft,
  ...props
}: CardButtonProps) => {
  const backgroundStyle =
    type === "primary" ? styles.primaryBackground : styles.secondaryBackground;
  return (
    <Pressable
      onPress={onPress}
      {...props}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
    >
      <ViewContent style={[styles.container, backgroundStyle]}>
        {iconLeft && <FontAwesome name={iconLeft} size={16} color="white" />}
        <Text style={[styles[type]]}>{title}</Text>
      </ViewContent>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    justifyContent: "center",
    borderRadius: 6,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  primary: {
    color: "#FFF",
    fontFamily: FONT_FAMILIES.SemiBold,
  },
  primaryBackground: {
    backgroundColor: "#3B5EDA",
    borderRadius: 6,
  },
  secondary: {
    color: "#aaa",
  },
  secondaryBackground: {
    backgroundColor: "#233883",
    borderRadius: 6,
  },
  destructive: {
    color: "#C72C1E",
    fontFamily: FONT_FAMILIES.SemiBold,
  },
});
