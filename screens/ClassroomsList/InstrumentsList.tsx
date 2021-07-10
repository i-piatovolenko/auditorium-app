import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {
  Modal,
  Portal,
  RadioButton,
} from "react-native-paper";

interface PropTypes {
  hideModal: () => void;
  visible: boolean;
  isGrandPianoOnly: boolean;
  setIsGrandPianoOnly: (value: boolean) => void;
}

export default function InstrumentsList({hideModal, visible, isGrandPianoOnly,
                                          setIsGrandPianoOnly}: PropTypes) {

  const handleSelect = (newValue: string) => {
    setIsGrandPianoOnly(newValue === '0')
    hideModal();
  };

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <View>
        <RadioButton.Group onValueChange={newValue => handleSelect(newValue)}
                           value={isGrandPianoOnly ? '0' : '1'}>
          <View style={styles.item}>
            <RadioButton value="0" />
            <Text>Рояль</Text>
          </View>
          <View style={styles.item}>
            <RadioButton value="1" />
            <Text>Піаніно або рояль</Text>
          </View>
        </RadioButton.Group>
      </View>
    </Modal>
  </Portal>
};

const styles = StyleSheet.create(({
  containerStyle: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));