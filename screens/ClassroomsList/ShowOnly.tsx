import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Headline, Modal, Portal, RadioButton} from "react-native-paper";
import {ClassroomsFilterTypes} from "../../models/models";

interface PropTypes {
  hideModal: () => void;
  visible: boolean;
  filterValue: string;
  setFilterValue: (value: ClassroomsFilterTypes) => void;
}

export default function ShowOnly({hideModal, visible, filterValue, setFilterValue}: PropTypes) {

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <Headline style={styles.title}>Відображати аудиторії</Headline>
      <RadioButton.Group onValueChange={newValue => setFilterValue(newValue as ClassroomsFilterTypes)}
                         value={filterValue}>
        <View style={styles.item}>
          <RadioButton value={ClassroomsFilterTypes.ALL} />
          <Text>Всі</Text>
        </View>
        <View style={styles.item}>
          <RadioButton value={ClassroomsFilterTypes.FREE} />
          <Text>Вільні</Text>
        </View>
        <View style={styles.item}>
          <RadioButton value={ClassroomsFilterTypes.SPECIAL} />
          <Text>Спеціалізовані</Text>
        </View>
        <View style={styles.item}>
          <RadioButton value={ClassroomsFilterTypes.INLINE} />
          <Text>Відфільтровані</Text>
        </View>
      </RadioButton.Group>
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
  title: {
    textAlign: "center",
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}));