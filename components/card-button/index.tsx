import {
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { ViewContent } from "../Themed";

type ButtonType = "primary" | "secondary" | "destructive";

interface CardButtonProps {
  onPress?: () => void;
  text?: string;
  type?: ButtonType;
}

export const CardButton = ({
  onPress,
  text,
  type = "primary",
}: CardButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ViewContent style={styles.container}>
        <Text style={[styles[type]]}>{text}</Text>
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
    color: "#4D9119",
    fontFamily: "NunitoSansSemiBold",
  },
  secondary: {
    color: "#aaa",
  },
  destructive: {
    color: "#C72C1E",
    fontFamily: "NunitoSansSemiBold",
  },
});
