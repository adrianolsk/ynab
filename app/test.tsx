import ScreenView from "@/components/screen-view";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Pressable, View } from "react-native";
import { Text } from "@/components/Themed";

interface ModalViewProps {
  header: React.ReactNode;
  children: React.ReactNode;
}
const ModalView = ({ header, children }: ModalViewProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <ScreenView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <Pressable
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={{
              flex: 1,
              // if modal dismiss dont work on android try uncomenting 2 lines
              // alignItems: "center",
              // flexDirection: "row",
              backgroundColor: "orange",
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "blue",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pressable
                style={{
                  // flex: 1,
                  width: "80%",
                  // backgroundColor: "red",
                  alignItems: "center",
                }}
              >
                <View style={styles.modalView}>
                  <View style={styles.header}>{header}</View>
                  <View style={styles.modalContent}>{children}</View>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    width: "100%",
    backgroundColor: "#0C1722",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#fff",
  },
  centeredView: {
    flex: 1,
    backgroundColor: "orange",
  },
  modalContent: {
    width: "100%",
    padding: 16,
    // backgroundColor: "red",
    // minHeight: 200,
  },
  modalView: {
    width: "100%",
    overflow: "hidden",

    // backgroundColor: "white",
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
    // textAlign: "center",
  },
});

export default ModalView;
