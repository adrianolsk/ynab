import React from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

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
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss}
    >
      <View style={styles.centeredView}>
        <Pressable
          onPress={onDismiss}
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable
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
            </Pressable>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#00000099",
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
  },
});

export { ModalView };
