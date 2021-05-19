import * as React from 'react';
import {Image, ImageBackground, StyleSheet} from 'react-native';
import {Button, Surface, TextInput} from 'react-native-paper';
import {Text, View} from '../components/Themed';
import {isLoggedVar} from "../api/client";
import {useMutation} from "@apollo/client";
import {LOGIN} from "../api/operations/mutations/login";
import {useState} from "react";

export default function Login({navigation}: any) {
  const [login] = useMutation(LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    let result: any;

    if (email && password) {
      try {
        result = await login({
          variables: {
            input: {
              email: email,
              password: password
            }
          }
        });
        if (result?.data.login.userErrors?.length) {

        } else {
          const user = result?.data.login.user;
          isLoggedVar(true);
        }
      } catch (e) {
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}>
        <Image source={require('./../assets/images/au_logo_shadow.png')} style={styles.logo}/>
        <Text style={styles.title}>Вхід</Text>
        <Surface style={styles.inputs}>
          <TextInput placeholder='Логін'
                     // placeholderTextColor='rgba(255, 255, 255, .7)'
                     style={styles.input}
                     onChangeText={(e) => setEmail(e)}
          />
          <TextInput placeholder='Пароль'
                     // placeholderTextColor='rgba(255, 255, 255, .7)'
                     style={{...styles.input, marginBottom: 32}}
                     onChangeText={(e) => setPassword(e)}
          />

        <Button onPress={handleSubmit} mode='contained' color='#2b5dff'
                style={styles.button} disabled={!email || !password}>
          Увійти
        </Button>
        <Button onPress={() => navigation.navigate('SignUp')} mode='contained' color='#f91354'
                style={styles.button}>
          Реєстрація
        </Button>
        </Surface>
        <Button onPress={() => navigation.navigate('ForgotPassword')} uppercase={false}
                labelStyle={{color: '#fff'}} style={styles.button}>
          Відновити пароль
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
    width: '100%',
    height: 40,
    fontSize: 22,
    paddingLeft: 10,
    marginTop: 16,
    backgroundColor: 'transparent',
    borderBottomColor: '#fff',
    // color: '#fff'
  },
  inputs: {
    width: '90%',
    elevation: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 32,
  },
  button: {
    marginTop: 16,
    width: '100%',
    height: 50,
    justifyContent: 'center',
  }, bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
