import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  ViewStyle,
} from "react-native";
import { ViewContent, Text } from "../Themed";
import { Pressable } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { PressableStateCallbackType } from "react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps";

type NumericKeyboardProps = {
  onPress: (value: string) => void;
  onBackspace: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  hideButtons?: boolean;
};

export const NumericKeyboard = React.memo(
  ({
    onPress,
    onBackspace,
    onConfirm,
    onCancel,
    hideButtons,
  }: NumericKeyboardProps) => {
    const keys = [
      ["1", "2", "3", "-"],
      ["4", "5", "6", "+"],
      ["7", "8", "9", "="],
      ["x", "0", "⌫", "DONE"], // Include backspace on the last row
    ];

    const onKeyPress = useCallback(
      (key: string) => () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (key === "⌫") {
          onBackspace();
        } else if (key === "DONE") {
          onConfirm();
        } else if (key === "x") {
          onCancel();
        } else {
          onPress(key);
        }
      },
      [onPress, onBackspace, onConfirm, onCancel]
    );

    const pressableStyle = useCallback(
      ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => {
        return [
          { flex: 1, alignItems: "center" },
          styles.key,
          pressed && styles.keyPressed,
        ];
      },
      []
    );

    return (
      <View style={styles.container}>
        {!hideButtons && (
          <View style={{ flexDirection: "row", gap: 16, paddingBottom: 12 }}>
            <TouchableOpacity style={styles.flex1} onPress={() => {}}>
              <ViewContent darkColor="#1D2B3A" style={styles.button}>
                <FontAwesome name="money" size={20} color="#aaa" />
                <Text style={{ fontSize: 12 }}>Assign</Text>
              </ViewContent>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flex1} onPress={() => {}}>
              <ViewContent darkColor="#1D2B3A" style={styles.button}>
                <FontAwesome name="bolt" size={20} color="#aaa" />
                <Text style={{ fontSize: 12 }}>Auto-Assign</Text>
              </ViewContent>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flex1} onPress={() => {}}>
              <ViewContent darkColor="#1D2B3A" style={styles.button}>
                <FontAwesome name="arrow-right" size={20} color="#aaa" />
                <Text style={{ fontSize: 12 }}>Move Money</Text>
              </ViewContent>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flex1} onPress={() => {}}>
              <ViewContent darkColor="#1D2B3A" style={styles.button}>
                <FontAwesome name="ellipsis-h" size={20} color="#aaa" />
                <Text style={{ fontSize: 12 }}>Details</Text>
              </ViewContent>
            </TouchableOpacity>
          </View>
        )}
        {keys.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((key) => (
              <Pressable
                key={key}
                style={pressableStyle}
                onPress={onKeyPress(key)}
              >
                <View style={styles.key}>
                  {key === "DONE" ? (
                    <Text style={styles.keyDone}>{key}</Text>
                  ) : key === "x" ? (
                    <FontAwesome name="times" size={20} color="#aaa" />
                  ) : (
                    <Text style={styles.keyText}>{key}</Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  button: {
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginBottom: 8,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 12,
    gap: 8,
  },
  key: {
    // borderWidth: 1,
    width: "100%",
    // flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    // backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#aaa",
  },
  keyPressed: {
    backgroundColor: "#1D2B3A",
  },
  keyDone: {},
  keyText: {
    fontSize: 24,
    // color: "#333",
  },
  confirmButton: {
    flex: 1,
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
