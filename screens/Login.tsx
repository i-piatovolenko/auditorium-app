import * as React from 'react';
import {Image, StyleSheet, TextInput} from 'react-native';
import { Button, Checkbox } from 'react-native-paper';

import { Text, View } from '../components/Themed';
import {useState} from "react";

export default function Login({navigation}: any) {
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <View style={styles.container}>
      <Image source={require('./../assets/images/au_logo.png')} style={styles.logo}/>
      <Text style={styles.title}>Вхід</Text>
      <TextInput placeholder='Логін' placeholderTextColor='rgba(255, 255, 255, .4)' style={styles.input}/>
      <TextInput placeholder='Пароль' placeholderTextColor='rgba(255, 255, 255, .4)' style={styles.input}/>
      <View style={styles.options}>
        <View style={styles.remember}>
          <Checkbox status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() => setRememberMe(prevState => !prevState)}/>
          <Text style={styles.rememberLogin}>Запам'ятати мене</Text>
        </View>
        <Button onPress={() => navigation.navigate('ForgotPassword')}
                uppercase={false} labelStyle={styles.forgotButton}>
          Відновити пароль
        </Button>
      </View>
      <View style={styles.navButtons}>
        <Button onPress={()=>navigation.navigate('SignUp')} mode='contained' color='#f91354'
          style={styles.signUpButton}>
          Зареєструватися
        </Button>
        <Button onPress={()=>navigation.navigate('SignUp')} mode='contained' color='#2b5dff'>
          Увійти
        </Button>
      </View>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    width: '80%',
    height: 40,
    fontSize: 22,
    paddingLeft: 10,
    marginTop: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderBottomColor: '#fff',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent'
  },
  options: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    width: '80%',
    justifyContent: 'space-between',
  },
  remember: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberLogin: {
    color: '#fff',
  },
  forgotButton: {
    color: '#fff'
  },
  navButtons: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  signUpButton: {
    marginRight: 16,
  }
});
