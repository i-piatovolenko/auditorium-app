import * as React from 'react';
import {View, StyleSheet, Text} from "react-native";
import {Button, TextInput} from "react-native-paper";

export default function ForgotPassword({navigation}: any) {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Введіть Вашу email адресу куди ми відправимо новий пароль.
      </Text>
      <TextInput placeholder="E-mail" style={styles.input}/>
      <Button onPress={()=>navigation.navigate('ForgotPasswordSuccess')} mode='contained' color='#2b5dff'
        style={styles.button}>
        Відновити пароль
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e287c',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    width: '90%',
    marginBottom: 32,
  },
  button: {
    marginTop: 32,
    height: 50,
    justifyContent: 'center'
  },
  input: {
    width: '90%',
    height: 50
  }
});
