import {
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  ButtonProps,
} from "react-native";
import React from "react";
import { ViewContent } from "../Themed";

type ButtonType = "primary" | "secondary" | "destructive";

interface CardButtonProps extends ButtonProps {
  onPress?: () => void;

  type?: ButtonType;
}

export const CardButton = ({
  onPress,
  title,
  type = "primary",
  ...props
}: CardButtonProps) => {
  const backgroundStyle =
    type === "primary" ? styles.primaryBackground : styles.secondaryBackground;
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <ViewContent style={[styles.container, backgroundStyle]}>
        <Text style={[styles[type]]}>{title}</Text>
      </ViewContent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#fff",
    padding: 16,
    alignItems: "center",
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
    backgroundColor: "#aaa",
    borderRadius: 6,
  },
  destructive: {
    color: "#C72C1E",
    fontFamily: "NunitoSansSemiBold",
  },
});
