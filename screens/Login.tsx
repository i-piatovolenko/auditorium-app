import * as React from 'react';
import {Image, ImageBackground, StyleSheet} from 'react-native';
import {Button, Surface, TextInput} from 'react-native-paper';
import {Text, View} from '../components/Themed';
import {isLoggedVar} from "../api/client";
import {useMutation} from "@apollo/client";
import {LOGIN} from "../api/operations/mutations/login";
import {useEffect, useState} from "react";
import WaitDialog from "../components/WaitDialog";
import {setItem} from "../api/asyncStorage";
import ErrorDialog from "../components/ErrorDialog";
import {ErrorCodes, ErrorCodesUa} from "../models/models";

export default function Login({navigation}: any) {
  const [login, {loading}] = useMutation(LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalActivator, setModalActivator] = useState<boolean | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (modalActivator !== null) {
      setShowError(true);
    }
  }, [modalActivator]);

  const hideError = () => {
    setShowError(false);
  };

  const handleSubmit = async () => {
    let result: any;
    if (email.length && password.length) {
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
          setErrorMessage(ErrorCodesUa[result?.data.login.userErrors[0].code as ErrorCodes]);
          setModalActivator(prevState => !prevState);
        } else {
          const user = result?.data.login.user;
          isLoggedVar(true);
          await setItem('user', user);
        }
      } catch (e) {
        setModalActivator(prevState => !prevState);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}>
        <Image source={require('./../assets/images/au_logo_shadow.png')} style={styles.logo}/>
        <Text style={styles.title}>Вхід</Text>
        <Surface style={styles.inputs}>
          <TextInput label='Логін'
                     style={styles.input}
                     onChangeText={(e) => setEmail(e)}
          />
          <TextInput label='Пароль'
                     style={{...styles.input, marginBottom: 16}}
                     onChangeText={(e) => setPassword(e)}
                     secureTextEntry={!showPassword}
                     selectionColor='#2b5dff'
                     right={<TextInput.Icon name={showPassword ? 'eye' : 'eye-off'} color='#2b5dff'
                                            onPress={() => setShowPassword(prevState => !prevState)}
                     />}
          />

        <Button onPress={handleSubmit} mode='contained' color='#2b5dff' loading={loading}
                style={styles.button} disabled={(!email || !password) || loading}>
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
        <View style={styles.footer}>
        <Text style={{color: '#fff'}}>Національна музична академія України ім. П. І. Чайковського</Text>
        <Text style={{color: '#ffffff77'}}>Розробники: Назаренко Владислав та Іван Пятоволенко</Text>
        <Text style={{color: '#fff'}}>Auditorium © 2021</Text>
        </View>
      </ImageBackground>
      <WaitDialog message='Відбувається вхід у систему' visible={loading}/>
      <ErrorDialog visible={showError} hideDialog={hideError} message={errorMessage}/>
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
    fontSize: 22,
    backgroundColor: 'transparent',
  },
  inputs: {
    width: '90%',
    elevation: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
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
  },
  footer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    position: "absolute",
    bottom: 16,
    opacity: .5,
  }
});
