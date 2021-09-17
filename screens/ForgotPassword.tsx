import * as React from 'react';
import {View, StyleSheet, Text, TextInput} from "react-native";
import {Button} from "react-native-paper";
import {useState} from "react";
import Colors from "../constants/Colors";
import {EMAIL_VALID} from "../helpers/validators";
import {client} from "../api/client";
import {EMAIL_FOR_PASSWORD_RESET} from "../api/operations/mutations/resetPasswordRequestEmail";

export default function ForgotPassword({navigation}: any) {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [visited, setVisited] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (text: string) => {
    const validated = EMAIL_VALID.test(text);
    setIsValidEmail(validated);
    setEmail(text);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const result = await client.mutate({
        mutation: EMAIL_FOR_PASSWORD_RESET,
        variables: {
          input: {
            email
          }
        }
      });
      if (result.data.resetPasswordRequestEmail.userErrors.length) {
        result.data.resetPasswordRequestEmail.userErrors.forEach(({message, code}: any) => {
          // alert(JSON.stringify(ErrorCodesUa[code as ErrorCodes]));
          alert(JSON.stringify(message));
        });
      } else {
        setLoading(false);
        navigation.navigate('ForgotPasswordSuccess')
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Введіть Вашу email адресу куди ми відправимо новий пароль.
      </Text>
      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={handleChange}
        onBlur={() => setVisited(true)}
      />
      {visited && !isValidEmail && <Text style={styles.errorText}>Невірний формат</Text>}
      <Button
        onPress={handleSendEmail}
        mode='contained'
        color={Colors.blue}
        disabled={!isValidEmail}
        loading={loading}
        style={styles.button}>
        Відновити пароль
      </Button>
      <Button
        onPress={goBack}
        mode='contained'
        color={Colors.red}
        disabled={loading}
        style={styles.button}>
        Назад
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
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    fontSize: 16
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
