import * as React from 'react';
import {View, StyleSheet, Text} from "react-native";
import {Button} from "react-native-paper";

export default function Verification({navigation}: any) {

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Реєстрація успішна!
      </Text>
      <Text style={styles.text}>
        Для доступу до застосунку підтвердіть свій аккаунт в учбовій частині.
      </Text>
      <Text style={styles.text}>
        Ваш номер користувача
      </Text>
      <Text style={styles.idNumber}>
        32443
      </Text>
      <Text style={styles.text}>
        був відісланий на електронну скриньку.
      </Text>
      <Text style={styles.text}>
        Після верифікації увійдіть до системи.
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
  logo: {
    width: '80%',
    resizeMode: 'contain',
    height: 130,
  },
  header: {
    color: '#fff',
    fontSize: 33,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  idNumber: {
    color: '#fff',
    fontSize: 50,
    textAlign: 'center',
    margin: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    opacity: .4,
  },
  loginButton: {
    marginTop: 32,
    height: 50,
    justifyContent: 'center'
  }
});
