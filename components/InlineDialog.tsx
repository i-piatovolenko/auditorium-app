import * as React from 'react';
import {Portal, Button, Modal} from 'react-native-paper';
import {View, Text, StyleSheet} from "react-native";
import {useState} from "react";

interface PropTypes {
  visible: boolean;
  hideDialog: () => void;
}

export default function InlineDialog({visible, hideDialog}: PropTypes) {
  const [queueLength, setQueueLength] = useState(27);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideDialog} contentContainerStyle={styles.containerStyle}>
        <View>
          <Text style={styles.header}>Вітаємо!</Text>
          <Text style={styles.paragraph}>Ви успішно стали в чергу!</Text>
          <Text style={styles.paragraph}>{`Перед Вами ${queueLength} людей.`}</Text>
          <View style={styles.buttons}>
            <Button mode='outlined' icon='information-outline'>
              Що робити далі?
            </Button>
            <Button mode='contained' onPress={hideDialog}>Закрити</Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8
  },
  header: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 16
  },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});