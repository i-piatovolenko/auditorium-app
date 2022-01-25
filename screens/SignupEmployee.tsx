import * as React from 'react';
import {View, StyleSheet, Text, ImageBackground, Linking} from "react-native";
import {Button, Surface, TextInput} from "react-native-paper";
import {useState} from "react";
import {PASSWORD_SOFT_VALID, PHONE_VALID, validationErrors} from "../helpers/validators";
import Colors from "../constants/Colors";
import {client} from "../api/client";
import {COMPLETE_EMPLOYEE_ACCOUNT} from "../api/operations/mutations/completeEmployeeAccount";
import {globalErrorVar} from "../api/localClient";

export default function SignupEmployee({navigation, route: {params: {completeEmployeeAccountToken}}}: any) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+380');
  const [visited, setVisited] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorMessagePhoneNumber, setErrorMessagePhoneNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleChangePhoneNumber = (value: string) => {
    setErrorMessagePhoneNumber(null);
    setPhoneNumber(value);
  }

  const handleChangePassword = (value: string) => {
    setErrorMessage(null);
    setPassword(value);
  };

  const handleChangePasswordConfirm = (value: string) => {
    setErrorMessage(null);
    setConfirmPassword(value);
  };

  const handleConfirmSignupEmployee = async () => {
    const validatePhone = PHONE_VALID.test(phoneNumber);
    const validate = PASSWORD_SOFT_VALID.test(password);
    if (String(password) !== String(confirmPassword)) {
      setErrorMessage(validationErrors.PASSWORDS_NOT_SAME);
    } else if (!validatePhone) {
      setErrorMessagePhoneNumber(`${validationErrors.INVALID_FORMAT} телефонного номеру`);
    } else if (!validate) {
      setErrorMessage(validationErrors.INVALID_PASSWORD);
    } else {
      setErrorMessage(null);
      setErrorMessagePhoneNumber(null);
      try {
        await client.mutate({
          mutation: COMPLETE_EMPLOYEE_ACCOUNT,
          variables: {
            input: {
              completeEmployeeAccountToken,
              password,
              phoneNumber
            }
          }
        });
        navigation.navigate('SignupEmployeeSuccess')
      } catch (e: any) {
        globalErrorVar(e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const goBack = () => {
    Linking.openURL('/');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}>
        <Text style={styles.title}>Реєстрація співробітника</Text>
        <Surface style={styles.inputs}>
          <TextInput
            placeholder="Тел. номер"
            style={styles.input}
            value={phoneNumber}
            onChangeText={handleChangePhoneNumber}
            onFocus={() => setVisited(true)}
          />
          {errorMessagePhoneNumber && <Text style={styles.errorText}>{errorMessagePhoneNumber}</Text>}
          <TextInput
            placeholder="Пароль"
            secureTextEntry={secureTextEntry}
            style={styles.input}
            value={password}
            onChangeText={handleChangePassword}
            onFocus={() => setVisited(true)}
            right={<TextInput.Icon name={secureTextEntry ? 'eye' : 'eye-off'} color='#ccc'
                                   onPress={() => setSecureTextEntry(prevState => !prevState)}
            />}
          />
          <TextInput
            placeholder="Повторіть пароль"
            secureTextEntry={secureTextEntry}
            style={styles.input}
            value={confirmPassword}
            onChangeText={handleChangePasswordConfirm}
            onFocus={() => setVisited(true)}
            right={<TextInput.Icon name={secureTextEntry ? 'eye' : 'eye-off'} color='#ccc'
                                   onPress={() => setSecureTextEntry(prevState => !prevState)}
            />}
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          <View style={styles.buttons}>
            <Button
              onPress={handleConfirmSignupEmployee}
              mode='contained'
              color={Colors.blue}
              style={styles.button}
              disabled={!!errorMessage || !!errorMessagePhoneNumber || !visited}
              loading={loading}
            >
              Зареєструватись
            </Button>
            <Button
              onPress={goBack}
              style={styles.button}
              disabled={loading}
            >
              На сторінку входу
            </Button>
          </View>
        </Surface>
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
  bg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
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
