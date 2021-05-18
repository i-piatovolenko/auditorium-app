import React from 'react';
import {StyleSheet, Text} from "react-native";
import {Modal, Portal} from "react-native-paper";

interface PropTypes {
  hideModal: () => void;
  visible: boolean;
}

export default function Filters({hideModal, visible}: PropTypes) {

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <Text>Filters</Text>
    </Modal>
  </Portal>
};

const styles = StyleSheet.create(({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 8
  },
}));