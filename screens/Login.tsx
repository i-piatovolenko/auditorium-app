import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import {Button, Surface, TextInput} from 'react-native-paper';
import {Text, View} from '../components/Themed';
import {useMutation} from "@apollo/client";
import {LOGIN} from "../api/operations/mutations/login";
import WaitDialog from "../components/WaitDialog";
import {setItem} from "../api/asyncStorage";
import ErrorDialog from "../components/ErrorDialog";
import {ErrorCodes, ErrorCodesUa, Platforms, User} from "../models/models";
import {client, meVar, noTokenVar} from "../api/client";
import PushNotification from "./PushNotification";
import i18n from "i18n-js";
import Colors from "../constants/Colors";
import * as Linking from "expo-linking";
import {CONFIRM_EMAIL} from "../api/operations/mutations/confirmEmail";
import InfoDialog from "../components/InfoDialog";
import WithKeyboardDismissWrapper from "../components/WithKeyboardDismissWrapper";

const {width: windowWidth} = Dimensions.get('window');

export default function Login({navigation}: any) {
  const [login, {loading}] = useMutation(LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalActivator, setModalActivator] = useState<boolean | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pushNotificationToken, setPushNotificationToken] = useState('');
  const [persNumber, setPersNumber] = useState(-1);
  const [visibleEmailConfirmSuccess, setVisibleEmailConfirmSuccess] = useState(false);

  useEffect(() => {
      Linking.getInitialURL().then(url => {
          const confirmEmailToken = Linking.parse(url).queryParams.confirmEmailToken;
          const resetPasswordToken = Linking.parse(url).queryParams.resetPasswordToken;
          if (resetPasswordToken) {
            navigation.navigate('ResetPassword', {resetPasswordToken});
          }
          if (confirmEmailToken) {
            client.mutate({
              mutation: CONFIRM_EMAIL,
              variables: {
                input: {
                  confirmEmailToken
                }
              }
            }).then((result: any) => {
                if (result.data.confirmEmail.userErrors.length) {
                  setErrorMessage(ErrorCodesUa[result.data.confirmEmail.userErrors[0] as ErrorCodes]);
                  setModalActivator(prevState => !prevState);
                } else {
                  const userId = result.data.confirmEmail.userId;
                  setPersNumber(userId);
                  setVisibleEmailConfirmSuccess(true);
                  setErrorMessage(null);
                }
              }
            ).catch(() => {
              setVisibleEmailConfirmSuccess(true);
              setErrorMessage('E-mail не було верифіковано');
              setModalActivator(prevState => !prevState);
            })
          }
        }
      )
    },
    []
  )
  ;

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
          await setItem('token', token);
          await setItem('user', user);
          meVar(user);
          noTokenVar(false);
        }
      } catch (e) {
        setErrorMessage(e?.graphQLErrors[0]?.message || JSON.stringify(e));
        setModalActivator(prevState => !prevState);
      }
    }
  };

  return (
    <WithKeyboardDismissWrapper>
      <View style={styles.container}>
        {Platform.OS !== Platforms.WEB && (
          <PushNotification setPushNotificationToken={setPushNotificationToken}/>
        )}
        <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}>
          <Image source={require('./../assets/images/au_logo_shadow.png')} style={styles.logo}/>
          <Text style={styles.title}>{i18n.t('login')}</Text>
          <Surface style={styles.inputs}>
            <TextInput label='E-mail'
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
            <Text style={{color: '#fff', textAlign: 'center', marginHorizontal: 16}}>
              Національна музична академія України ім. П. І. Чайковського
            </Text>
            <Text style={{color: '#fff', marginTop: 16, textAlign: 'center'}}>
              Auditorium © 2021
            </Text>
          </View>
        </ImageBackground>
        <InfoDialog
          message={'Ваш e-mail успішно підтверджено. Останній крок: підтвердіть свої дані. Для цього підійдіть до учбової частини з документом (студентський, аспірантський, тощо) та вкажіть ваш персональний номер ( ' + persNumber + " ) або П.І.Б."}
          visible={visibleEmailConfirmSuccess}
          hideDialog={() => setVisibleEmailConfirmSuccess(false)}
          confirmButton
        />
        <WaitDialog message='Відбувається вхід у систему' visible={loading}/>
        <ErrorDialog visible={showError} hideDialog={hideError} message={errorMessage}/>
      </View>
    </WithKeyboardDismissWrapper>
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
    marginTop: 24,
    width: '80%',
    resizeMode: 'contain',
    flex: 1
  },
  title: {
    fontSize: 24,
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
  },
  bg: {
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
  },
  carousel: {
    flexGrow: 0,
    height: 300,
  },
  item: {},
  hintsPopup: {
    elevation: 25,
    zIndex: 1000,
    borderRadius: 9,
    position: 'absolute',
    width: windowWidth * .9,
    backgroundColor: '#fff',
// overflow: 'hidden',
    paddingHorizontal: 16
  },
  hintsTitle: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  hintsTitleText: {
    marginTop: 24,
    color: Colors.darkBlue,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16
  },
  helpImage: {
    width: 48,
    height: 48,
    position: 'absolute',
    left: 8,
    top: 16,
    opacity: .3
  },
  helpImageButton: {
    width: 32,
    height: 32,
  },
  helpImageButtonWrapper: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  hintImage: {
    height: 180
  },
  hintDescription: {
    marginTop: 16
  },
  checkbox: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  closeIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 1001
  },
  tempId: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1001,
    backgroundColor: '#fff',
    elevation: 14,
    borderRadius: 6
  },
  tempIdText: {
    color: '#000',
    fontSize: 24,
    fontWeight: "bold",
    padding: 8
  }
});
