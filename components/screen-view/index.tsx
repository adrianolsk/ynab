import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

interface ScreenViewProps {
  children: React.ReactNode;
}
const ScreenView = ({ children }: ScreenViewProps) => {
  return (
    <ScrollView>
      <View style={styles.container}>{children}</View>
    </ScrollView>
  );
};

export default ScreenView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
