import * as React from 'react';
import {View, StyleSheet, Text} from "react-native";
import {Button, TextInput} from "react-native-paper";
import {useState} from "react";
import {PASSWORD_SOFT_VALID} from "../helpers/validators";
import Colors from "../constants/Colors";
import {client} from "../api/client";
import {PASSWORD_RESET} from "../api/operations/mutations/resetPassword";

const PASSWORDS_NOT_SAME = 'Паролі не співпадають'
const INVALID_PASSWORD = 'Невірний формат'

export default function ResetPassword({navigation, route: {params: {resetPasswordToken}}}: any) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visited, setVisited] = useState(false);
  const [errorMessage, setErrorMessage] = useState(INVALID_PASSWORD);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = (value: string) => {
    const validate = PASSWORD_SOFT_VALID.test(value);
    if (!validate) {
      setErrorMessage(INVALID_PASSWORD);
    } else {
      setErrorMessage(null);
    }
    setPassword(value);
  };

  const handleChangePasswordConfirm = (value: string) => {
    setLoading(true);
    if (password !== value) {
      setErrorMessage(PASSWORDS_NOT_SAME);
    } else {
      setErrorMessage(null);
    }
    setConfirmPassword(value);
  };

  const handleConfirmResetPassword = async () => {
    try {
      const result = await client.mutate({
        mutation: PASSWORD_RESET,
        variables: {
          input: {
            resetPasswordToken,
            password
          }
        }
      });
      if (result.data.resetPassword.userErrors.length) {
        result.data.resetPassword.userErrors.forEach(({message, code}: any) => {
          // alert(JSON.stringify(ErrorCodesUa[code as ErrorCodes]));
          alert(JSON.stringify(message));
        });
      } else {
        setLoading(false);
        navigation.navigate('ResetPasswordSuccess')
      }
    } catch (e) {
      setLoading(false);
      console.log(e)
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Введіть новий пароль.
      </Text>
      <TextInput
        placeholder="Пароль"
        style={styles.input}
        value={password}
        onChangeText={handleChangePassword}
        onFocus={() => setVisited(true)}
      />
      <TextInput
        placeholder="Повторіть пароль"
        style={styles.input}
        value={confirmPassword}
        onChangeText={handleChangePasswordConfirm}
        onFocus={() => setVisited(true)}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <Button
        onPress={handleConfirmResetPassword}
        mode='contained'
        color={Colors.blue}
        style={styles.button}
        disabled={!!errorMessage && !visited}
        loading={loading}
      >
        Змінити пароль
      </Button>
      <Button
        onPress={goBack}
        mode='contained'
        color={Colors.red}
        style={styles.button}
        disabled={loading}
      >
        Не змінювати і повернутись на сторінку входу
      </Button>
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
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
    width: '90%',
    marginBottom: 32,
  },
  button: {
    marginTop: 32,
    height: 50,
    justifyContent: 'center'
  },
  input: {
    width: '90%',
    height: 50
  },
  errorText: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    color: Colors.red,
    textAlign: 'center'
  }
});
