import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Linking,
  KeyboardAvoidingView,
  Dimensions,
  Platform
} from "react-native";
import {Button, Surface, TextInput} from "react-native-paper";
import {useRef, useState} from "react";
import {PASSWORD_SOFT_VALID, validationErrors} from "../helpers/validators";
import Colors from "../constants/Colors";
import {client} from "../api/client";
import {PASSWORD_UPDATE} from "../api/operations/mutations/updatePassword";
import {Platforms} from "../models/models";
import WithKeyboardDismissWrapper from "../components/WithKeyboardDismissWrapper";
import {globalErrorVar} from "../api/localClient";

const {width: windowWidth} = Dimensions.get('window');
const {height: windowHeight} = Dimensions.get('window');

export default function UpdatePassword({navigation}: any) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [visited, setVisited] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const newPasswordRef = useRef(null);
  const newPasswordConfirmRef = useRef(null);

  const handleChangeOldPassword = (value: string) => {
    setErrorMessage(null);
    setOldPassword(value);
  };

  const handleChangePassword = (value: string) => {
    setErrorMessage(null);
    setNewPassword(value);
  };

  const handleChangePasswordConfirm = (value: string) => {
    setErrorMessage(null);
    setConfirmNewPassword(value);
  };

  const handleConfirmResetPassword = async () => {
    const validate = PASSWORD_SOFT_VALID.test(newPassword);
    if (!validate) {
      setErrorMessage(validationErrors.INVALID_PASSWORD);
    } else if (String(newPassword) !== String(confirmNewPassword)) {
      setErrorMessage(validationErrors.PASSWORDS_NOT_SAME);
    } else {
      setErrorMessage(null);
      try {
        await client.mutate({
          mutation: PASSWORD_UPDATE,
          variables: {
            input: {
              oldPassword,
              newPassword
            }
          }
        });
        navigation.navigate('UpdatePasswordSuccess')
      } catch (e: any) {
        globalErrorVar(e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const goBack = () => {
    Linking.openURL('/');
    navigation.navigate('Profile');
  };

  return (
    <WithKeyboardDismissWrapper>
      <View style={styles.container}>
        <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}>
          <KeyboardAvoidingView behavior='padding' style={styles.avoidingView} enabled={Platform.OS === Platforms.IOS}>
            <Text style={styles.title}>Зміна паролю</Text>
            <Surface style={styles.inputs}>
              <TextInput
                placeholder="Старий пароль"
                secureTextEntry={secureTextEntry}
                returnKeyType='next'
                autoCompleteType='password'
                style={styles.input}
                value={oldPassword}
                onChangeText={handleChangeOldPassword}
                onFocus={() => setVisited(true)}
                onSubmitEditing={() => newPasswordRef.current.focus()}
                right={<TextInput.Icon name={secureTextEntry ? 'eye' : 'eye-off'} color='#ccc'
                                       onPress={() => setSecureTextEntry(prevState => !prevState)}
                />}
              />
              <TextInput
                placeholder="Новий пароль"
                ref={newPasswordRef}
                secureTextEntry={secureTextEntry}
                returnKeyType='next'
                style={styles.input}
                value={newPassword}
                onChangeText={handleChangePassword}
                onFocus={() => setVisited(true)}
                onSubmitEditing={() => newPasswordConfirmRef.current.focus()}
                right={<TextInput.Icon name={secureTextEntry ? 'eye' : 'eye-off'} color='#ccc'
                                       onPress={() => setSecureTextEntry(prevState => !prevState)}
                />}
              />
              <TextInput
                placeholder="Повторіть новий пароль"
                ref={newPasswordConfirmRef}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                value={confirmNewPassword}
                onChangeText={handleChangePasswordConfirm}
                returnKeyType='done'
                onFocus={() => setVisited(true)}
                onSubmitEditing={handleConfirmResetPassword}
                right={<TextInput.Icon name={secureTextEntry ? 'eye' : 'eye-off'} color='#ccc'
                                       onPress={() => setSecureTextEntry(prevState => !prevState)}
                />}
              />
              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
              <View style={styles.buttons}>
                <Button
                  onPress={handleConfirmResetPassword}
                  mode='contained'
                  color={Colors.blue}
                  style={styles.button}
                  disabled={!!errorMessage || !visited}
                  loading={loading}
                >
                  Змінити пароль
                </Button>
                <Button
                  onPress={goBack}
                  style={styles.button}
                  disabled={loading}
                >
                  Назад
                </Button>
              </View>
            </Surface>
          </KeyboardAvoidingView>
        </ImageBackground>
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
  },
  bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
    height: windowHeight
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
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
  text: {
    color: Colors.darkBlue,
    paddingTop: 16,
    fontSize: 16,
    textAlign: 'center',
    width: '90%',
  },
  button: {
    width: '100%',
    marginTop: 8,
    height: 50,
    justifyContent: 'center'
  },
  input: {
    marginTop: 16,
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    color: Colors.red,
    textAlign: 'center'
  },
  buttons: {
    marginTop: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
