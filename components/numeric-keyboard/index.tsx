import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type NumericKeyboardProps = {
  onPress: (value: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
};

export const NumericKeyboard: React.FC<NumericKeyboardProps> = ({
  onPress,
  onBackspace,
  onConfirm,
}) => {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "⌫"], // Include backspace on the last row
  ];

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => {
                if (key === "⌫") {
                  onBackspace();
                } else {
                  onPress(key);
                }
              }}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  key: {
    width: 60,
    // height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
  },
  keyText: {
    fontSize: 24,
    color: "#333",
  },
  confirmButton: {
    marginTop: 16,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 18,
    color: "white",
  },
});
