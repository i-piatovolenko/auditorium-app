import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Modal, Portal, Title} from "react-native-paper";
import Colors from "../constants/Colors";

type PropTypes = {
  chosenDay: number;
  setChosenDay: (day: number) => void;
  hideModal: () => void;
  visible: boolean
}

const DAYS = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];

const ChooseDayModal: FC<PropTypes> = ({chosenDay, setChosenDay, hideModal, visible}) => {
  const handlePress = (index: number) => {
    setChosenDay(index);
    hideModal();
  };

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <Title>Виберіть день тижня</Title>
      {DAYS.map((day, index) => (
        <TouchableOpacity onPress={() => handlePress(index)}>
          <View
            style={chosenDay === index ? styles.chosenListItem : styles.listItem}
          >
            <Text
              key={index}
              style={chosenDay === index ?  styles.chosenText : styles.text}
            >
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </Modal>
  </Portal>
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 8
  },
  listItem: {
    paddingVertical: 8,
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 1,
  },
  chosenListItem: {
    paddingVertical: 8,
    borderBottomColor: Colors.blue,
    borderBottomWidth: 1,
  },
  text: {
    color: '#000',
  },
  chosenText: {
    color: Colors.blue,
  },
});

export default ChooseDayModal;
