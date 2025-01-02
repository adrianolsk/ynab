import { StyleSheet, View } from "react-native";
import React from "react";

const Separator = () => {
  return <View style={styles.separator}></View>;
};

export { Separator };

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#555",
    height: 1,
    width: "100%",
  },
});
