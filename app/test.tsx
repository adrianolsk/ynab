import ScreenView from "@/components/screen-view";
import React from "react";
import { StyleSheet, View } from "react-native";

const Test = () => {
  return (
    <ScreenView>
      <View style={styles.container}></View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});

export default Test;
