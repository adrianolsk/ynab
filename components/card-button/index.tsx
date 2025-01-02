import React from "react";
import { ButtonProps, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ViewContent } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";

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
    <TouchableOpacity onPress={onPress} {...props}>
      <ViewContent style={[styles.container, backgroundStyle]}>
        {iconLeft && <FontAwesome name={iconLeft} size={16} color="white" />}
        <Text style={[styles[type]]}>{title}</Text>
      </ViewContent>
    </TouchableOpacity>
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
    fontFamily: "NunitoSansSemiBold",
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
    fontFamily: "NunitoSansSemiBold",
  },
});
