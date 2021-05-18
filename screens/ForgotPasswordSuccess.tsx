import * as React from 'react';
import {View, StyleSheet, Text} from "react-native";
import {Button} from "react-native-paper";

export default function ForgotPasswordSuccess({navigation}: any) {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Пароль надіслано, перевірте пошту.
      </Text>
      <Button onPress={()=>navigation.navigate('Login')} mode='contained' color='#2b5dff'
        style={styles.loginButton}>
        На сторінку входу
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
  loginButton: {
    marginTop: 32,
    height: 50,
    justifyContent: 'center'
  },
  input: {
    width: '90%',
    height: 50
  }
});
