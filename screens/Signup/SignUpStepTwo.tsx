import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from "react-native";
import {Appbar, Button, Title} from "react-native-paper";

export default function SignUpStepTwo() {
  const navigation = useNavigation();
  const message1 = 'Щоб підтвердити вказаний e-mail, перейдіть за посиланням, яке ми' +
    ' надіслали на Вашу адресу.';
  const message2 = 'Далі пройдіть верифікацію в учбовій частині.';


  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return <ImageBackground source={require('../../assets/images/bg.jpg')}
                          style={{width: '100%', height: '100%'}}>
    <View style={styles.container}>
      <Appbar style={styles.top}>
        <Appbar.BackAction onPress={navigateToLogin}/>
        <Appbar.Content title='Реєстрація' subtitle='Крок 2 із 3' color='#fff'/>
      </Appbar>
      <View style={styles.wrapper}>
        <Title style={styles.title}>Вітаємо! Реєстрація успішна!</Title>
        <Text style={styles.message}>{message1}</Text>
        <Text style={styles.message}>{message2}</Text>
        <Button mode='contained' style={styles.button} onPress={navigateToLogin}>На сторінку входу</Button>
      </View>
    </View>
  </ImageBackground>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: 'transparent',
    elevation: 0
  },
  wrapper: {},
  title: {
    textAlign: 'center',
    fontSize: 32,
    padding: 20,
    lineHeight: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30
  },
  message: {
    textAlign: 'center',
    borderRadius: 8,
    backgroundColor: '#b5e3ff77',
    padding: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 20,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: 50,
    height: 50,
    justifyContent: 'center'
  }
});