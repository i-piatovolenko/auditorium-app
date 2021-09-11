import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {CheckBox, Dimensions, Image, ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Checkbox, IconButton, Paragraph, Surface, TextInput, Title} from 'react-native-paper';
import {Text, View} from '../components/Themed';
import {useMutation} from "@apollo/client";
import {LOGIN} from "../api/operations/mutations/login";
import WaitDialog from "../components/WaitDialog";
import {getItem, removeItem, setItem} from "../api/asyncStorage";
import ErrorDialog from "../components/ErrorDialog";
import {ErrorCodes, ErrorCodesUa, Langs, User} from "../models/models";
import {client, meVar, noTokenVar} from "../api/client";
import PushNotification from "./PushNotification";
import i18n from "i18n-js";
// @ts-ignore
import Carousel from 'react-native-anchor-carousel';
import Colors from "../constants/Colors";
import SimplePaginationDot from "../components/SimplePaginationDot";
import * as Linking from "expo-linking";
import {CONFIRM_EMAIL} from "../api/operations/mutations/confirmEmail";
import InfoDialog from "../components/InfoDialog";

const {width: windowWidth} = Dimensions.get('window');

const INITIAL_INDEX = 0;

const hintTexts = [
  'Ви можете зберегти додаток на головному екрані.',
  'Щоб користуватись додатком, пройдіть реєстрацію. Вкажіть дійсні дані, які співпадають з Вашим студентським квитком або іншим документом.',
  'Вкажіть дійсний e-mail. На нього буде відправлено повідомлення з підтвердженням.',
  'Після реєстрації перевірте електронну пошту. В надісланому повідомленні перейдіть за посиланням. Після цього повідомте верифікаційний номер в учбовій частині.'
]

export default function Login({route, navigation}: any) {
  const [login, {loading}] = useMutation(LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalActivator, setModalActivator] = useState<boolean | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pushNotificationToken, setPushNotificationToken] = useState('');
  const carouselRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [persNumber, setPersNumber] = useState(-1);
  const [visibleEmailConfirmSuccess, setVisibleEmailConfirmSuccess] = useState(false);

  function handleCarouselScrollEnd(item: any, index: number) {
    setCurrentIndex(index);
  }

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          carouselRef.current.scrollToIndex(index);
        }}>
        <View>
          {/*<Image source={require(`../assets/images/hint_${index + 1}.jpg`)} style={styles.hintImage}/>*/}
        </View>
        <Paragraph style={styles.hintDescription}>
          {hintTexts[index]}
        </Paragraph>
      </TouchableOpacity>
    );
  }
  // const {data: {lang}} = useQuery(GET_LANG);

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      const confirmEmailToken = Linking.parse(url).queryParams.confirmEmailToken;
      if (confirmEmailToken) {
        client.mutate({
          mutation: CONFIRM_EMAIL,
          variables: {
            input: {
              confirmEmailToken
            }
          }
        }).then((result: any) => {
          setPersNumber(result.confirmEmail.user.id);
          setVisibleEmailConfirmSuccess(true);
        }).catch(() => {
          setVisibleEmailConfirmSuccess(true);
          setErrorMessage('E-mail не було верифіковано');
          setModalActivator(prevState => !prevState);
        })
      }
    })
  }, [])

  useEffect(() => {
    getItem('dontShowLoginHints').then(result => {
      setShowHints(!result);
      setDontShowAgain(result);
    });
  }, []);

  useEffect(() => {
    if (modalActivator !== null) {
      setShowError(true);
    }
  }, [modalActivator]);

  // useEffect(() => {
  //   getItem('lang').then(res => {
  //     if (res) {
  //       langVar(res);
  //     } else {
  //       setItem('lang', lang);
  //     }
  //   });
  // }, []);

  const handleChangeLang = async (lng: Langs) => {
    // await setItem('lang', lng);
    // langVar(lng);
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
          // if (user.queue.length) {
          //   const minimal = user.queue.filter(({type, state}) => {
          //     return type === QueueType.MINIMAL && state === QueueState.ACTIVE;
          //   });
          //   const desired = user.queue.filter(({type, state}) => {
          //     return type === QueueType.DESIRED && state === QueueState.ACTIVE;
          //   });
          //   modeVar(Mode.INLINE);
          //   minimalClassroomIdsVar(minimal.map(({classroom: {id}}) => id));
          //   desirableClassroomIdsVar(desired.map(({classroom: {id}}) => id));
          // }
          meVar(user);
          noTokenVar(false);
        }
      } catch (e) {
        setErrorMessage(e?.graphQLErrors[0]?.message || JSON.stringify(e));
        setModalActivator(prevState => !prevState);
      }
    }
  };

  const handleShowHints = () => {
    setShowHints(prevState => !prevState);
  };

  const handleRememberDontShowHints = async () => {
    if (!dontShowAgain) {
      await setItem('dontShowLoginHints', true);
    } else {
      await removeItem('dontShowLoginHints');
    }
    setDontShowAgain(!dontShowAgain);
  }

  return (
    <View style={styles.container}>
      {/*<PushNotification setPushNotificationToken={setPushNotificationToken}/>*/}
      <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}>
        <TouchableOpacity onPress={handleShowHints}
                          style={styles.helpImageButtonWrapper}>
          <Image source={require('../assets/images/help_white.png')} style={styles.helpImageButton}/>
        </TouchableOpacity>
        {/*<Surface style={[styles.hintsPopup, {display: showHints ? 'flex' : 'none'}]}>*/}
        {/*  <IconButton icon='close' color={Colors.red} onPress={handleShowHints} style={styles.closeIcon}/>*/}
        {/*  <View style={styles.hintsTitle}>*/}
        {/*    <Text style={styles.hintsTitleText}>Корисні поради</Text>*/}
        {/*    <Image source={require('../assets/images/help.png')} style={styles.helpImage}/>*/}
        {/*  </View>*/}
        {/*  <Carousel*/}
        {/*    ref={carouselRef}*/}
        {/*    data={Array(4).fill(0)}*/}
        {/*    renderItem={renderItem}*/}
        {/*    style={styles.carousel}*/}
        {/*    itemWidth={windowWidth * 0.75}*/}
        {/*    containerWidth={windowWidth * 0.85}*/}
        {/*    onScrollEnd={handleCarouselScrollEnd}*/}
        {/*    separatorWidth={8}*/}
        {/*  />*/}
        {/*  <View style={styles.checkbox}>*/}
        {/*    <Checkbox*/}
        {/*      status={dontShowAgain ? 'checked' : 'unchecked'}*/}
        {/*      onPress={handleRememberDontShowHints}*/}
        {/*    />*/}
        {/*    <Paragraph>Більше не показувати</Paragraph>*/}
        {/*  </View>*/}
        {/*  /!*<SimplePaginationDot currentIndex={currentIndex} length={4} />*!/*/}
        {/*</Surface>*/}
        <Image source={require('./../assets/images/au_logo_shadow.png')} style={styles.logo}/>
        {/*<View style={styles.langSwitcher}>*/}
        {/*  <TouchableHighlight onPress={() => handleChangeLang(Langs.UA)}>*/}
        {/*    <Image source={require('../assets/images/ua.png')}*/}
        {/*           style={lang === Langs.UA ? styles.langImageSelected : styles.langImage}*/}
        {/*    />*/}
        {/*  </TouchableHighlight>*/}
        {/*  <TouchableHighlight onPress={() => handleChangeLang(Langs.EN)}>*/}
        {/*    <Image source={require('../assets/images/en.png')}*/}
        {/*           style={lang === Langs.EN ? styles.langImageSelected : styles.langImage}*/}
        {/*    />*/}
        {/*  </TouchableHighlight>*/}
        {/*</View>*/}
        <Text style={styles.title}>{i18n.t('login')}</Text>
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
      <InfoDialog
        message={`Ваш e-mail успішно підтверджено. Останній крок: підтвердіть свої дані. Для цього підійдіть до учбової частини з документом (студентський, аспірантський, тощо) та вкажіть ваш персональний номер (${persNumber})`}
        visible={visibleEmailConfirmSuccess}
        hideDialog={() => setVisibleEmailConfirmSuccess(false)}
        confirmButton
      />
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
  }
});
