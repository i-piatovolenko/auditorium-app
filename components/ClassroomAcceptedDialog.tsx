import * as React from 'react';
import {Portal, Button, Modal} from 'react-native-paper';
import {View, Text, StyleSheet} from "react-native";
import {useState} from "react";
import {acceptedClassroomVar} from "../api/client";
import {useLocal} from "../hooks/useLocal";

export default function ClassroomAcceptedDialog() {
  const {data: {acceptedClassroom}} = useLocal('acceptedClassroom');
  return (
    <Portal>
      <Modal visible={acceptedClassroom}
             onDismiss={() => acceptedClassroomVar(false)}
             contentContainerStyle={styles.containerStyle}>
        <View>
          <Text style={styles.header}>Вітаємо!</Text>
          <Text style={styles.paragraph}>Ви підтвердили аудиторію. У вас є 15 хв. щоб взяти ключ в учбовій
            частині.</Text>
          <Text style={styles.paragraph}>Максимальний час знаходження в аудиторії - 3 год. (включно з 15 хв.)</Text>
          <Text style={styles.paragraph}>Поверніть ключ в учбову частину <Text
            style={{fontWeight: 'bold'}}>до</Text> закінчення 3-х годин.</Text>
          <View style={styles.buttons}>
            <Button mode='contained' onPress={() => acceptedClassroomVar(false)}>Закрити</Button>
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
    justifyContent: 'center'
  }
});