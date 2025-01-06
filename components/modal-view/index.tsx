import React from "react";
import { Modal, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

interface ModalViewProps {
  header: React.ReactNode;
  children: React.ReactNode;
  isVisible: boolean;
  onDismiss: () => void;
  modalContentStyle?: StyleProp<ViewStyle>;
  modalHeaderStyle?: StyleProp<ViewStyle>;
}
const ModalView = ({
  header,
  children,
  isVisible,
  onDismiss,
  modalContentStyle,
  modalHeaderStyle,
}: ModalViewProps) => {
  return (
    <View
      style={{ flex: 1, flexDirection: "row" }}
      // animationType="fade"
      // transparent={true}
      // visible={isVisible}
      // onRequestClose={onDismiss}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable onPress={onDismiss} style={styles.modalOverlay}></Pressable>
        <View style={styles.centeredView}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: "80%",
                alignItems: "center",
              }}
            >
              <View style={styles.modalView}>
                <View style={[styles.header, modalHeaderStyle]}>{header}</View>
                <View style={[styles.modalContent, modalContentStyle]}>
                  {children}
                </View>
              </View>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00000099",
  },
  header: {
    height: 50,
    width: "100%",
    backgroundColor: "#0C1722",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
  },
  modalContent: {
    width: "100%",
    padding: 16,
  },
  modalView: {
    width: "100%",
    overflow: "hidden",

    backgroundColor: "#0C1722",
    borderRadius: 8,

    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export { ModalView };
