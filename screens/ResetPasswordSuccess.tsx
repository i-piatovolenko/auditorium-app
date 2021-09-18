import * as React from 'react';
import {View, StyleSheet, Text, Linking, ImageBackground} from "react-native";
import {Button} from "react-native-paper";

export default function ResetPasswordSuccess({navigation}: any) {

  const goToLoginPage = () => {
    Linking.openURL('/');
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}>
        <Text style={styles.text}>
          Пароль успішно змінено
        </Text>
        <Button onPress={goToLoginPage} mode='contained' color='#2b5dff'
          style={styles.loginButton}>
          Повернутись на сторінку входу
        </Button>
      </ImageBackground>
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
  checkMark: {
    width: '60%',
    resizeMode: 'contain',
    flex: 1
  },
  bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
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
  },
});