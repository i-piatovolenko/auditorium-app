import * as React from 'react';
import {useEffect, useState} from 'react';
import {Image, ImageBackground, StyleSheet, TouchableHighlight} from 'react-native';
import {Button, Surface, TextInput} from 'react-native-paper';
import {Text, View} from '../components/Themed';
import {useMutation, useQuery} from "@apollo/client";
import {LOGIN} from "../api/operations/mutations/login";
import WaitDialog from "../components/WaitDialog";
import {getItem, setItem} from "../api/asyncStorage";
import ErrorDialog from "../components/ErrorDialog";
import {ErrorCodes, ErrorCodesUa, Langs, Mode, QueueState, QueueType, User} from "../models/models";
import {desirableClassroomIdsVar, langVar, meVar, minimalClassroomIdsVar, modeVar, wsLink} from "../api/client";
import PushNotification from "./PushNotification";
import {GET_LANG} from "../api/operations/queries/lang";

export default function Login({route, navigation}: any) {
  const [login, {loading}] = useMutation(LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalActivator, setModalActivator] = useState<boolean | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pushNotificationToken, setPushNotificationToken] = useState('');
  const {data: {lang}} = useQuery(GET_LANG);

  useEffect(() => {
    if (modalActivator !== null) {
      setShowError(true);
    }
  }, [modalActivator]);

  useEffect(() => {
    getItem('lang').then(res => {
      if (res) {
        langVar(res);
      } else {
        setItem('lang', lang);
      }
    });
  }, []);

  const handleChangeLang = async (lng: Langs) => {
    await setItem('lang', lng);
    langVar(lng);
  };

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
              password: password,
              notificationToken: pushNotificationToken
            }
          }
        });
        if (result?.data.login.userErrors?.length) {
          setErrorMessage(ErrorCodesUa[result?.data.login.userErrors[0].code as ErrorCodes]);
          setModalActivator(prevState => !prevState);
        } else {
          const user: User = result?.data.login.user;
          const token: string = result?.data.login.token;
          await setItem('user', user);
          await setItem('token', token);
          if (user.queue.length) {
            const minimal = user.queue.filter(({type, state}) => {
              return type === QueueType.MINIMAL && state === QueueState.ACTIVE;
            });
            const desired = user.queue.filter(({type, state}) => {
              return type === QueueType.DESIRED && state === QueueState.ACTIVE;
            });
            modeVar(Mode.INLINE);
            minimalClassroomIdsVar(minimal.map(({classroom: {id}}) => id));
            desirableClassroomIdsVar(desired.map(({classroom: {id}}) => id));
          }
          meVar(user);
        }
      } catch (e) {
        setErrorMessage(e?.graphQLErrors[0]?.message || JSON.stringify(e));
        setModalActivator(prevState => !prevState);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/*<PushNotification setPushNotificationToken={setPushNotificationToken}/>*/}
      <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}>
        <Image source={require('./../assets/images/au_logo_shadow.png')} style={styles.logo}/>
        <View style={styles.langSwitcher}>
          <TouchableHighlight onPress={() => handleChangeLang(Langs.UA)}>
            <Image source={require('../assets/images/ua.png')}
                   style={lang === Langs.UA ? styles.langImageSelected : styles.langImage}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => handleChangeLang(Langs.EN)}>
            <Image source={require('../assets/images/en.png')}
                   style={lang === Langs.EN ? styles.langImageSelected : styles.langImage}
            />
          </TouchableHighlight>
        </View>
        <Text style={styles.title}>Вхід</Text>
        <Surface style={styles.inputs}>
          <TextInput label='Логін'
                     style={styles.input}
                     onChangeText={(e) => setEmail(e)}
          />
          <TextInput label='Пароль'
                     style={styles.input}
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
          <Text style={{color: '#fff', marginTop: 16}}>Auditorium © 2021</Text>
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
    overflow: 'hidden'
  },
  logo: {
    width: '80%',
    resizeMode: 'contain',
    flex: 1
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
    textAlign: 'center',
    opacity: .5,
    marginBottom: 16
  },
  langSwitcher: {
    justifyContent: 'center',
    flexDirection: "row",
    marginBottom: 16
  },
  langImage: {
    width: 50,
    height: 35,
    opacity: .3
  },
  langImageSelected: {
    width: 50,
    height: 35,
  }
});
