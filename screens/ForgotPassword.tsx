import * as React from 'react';
import {View, StyleSheet, Text, ImageBackground, KeyboardAvoidingView, Dimensions, Platform} from "react-native";
import {Button, Surface, TextInput} from "react-native-paper";
import {useState} from "react";
import Colors from "../constants/Colors";
import {EMAIL_VALID} from "../helpers/validators";
import {client} from "../api/client";
import {EMAIL_FOR_PASSWORD_RESET} from "../api/operations/mutations/resetPasswordRequestEmail";
import ErrorDialog from "../components/ErrorDialog";
import {ErrorCodes, ErrorCodesUa, Platforms} from "../models/models";
import WithKeyboardDismissWrapper from "../components/WithKeyboardDismissWrapper";

const {width: windowWidth} = Dimensions.get('window');
const {height: windowHeight} = Dimensions.get('window');

export default function ForgotPassword({navigation}: any) {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [visited, setVisited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
          setErrorMessage(ErrorCodesUa[code as ErrorCodes]);
          setLoading(false);
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
    <WithKeyboardDismissWrapper>
      <View style={styles.container}>
        <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.bg}>
          <KeyboardAvoidingView behavior='padding' style={styles.avoidingView} enabled={Platform.OS === Platforms.IOS}>
            <Text style={styles.title}>Відновлення паролю</Text>
            <Surface style={styles.inputs}>
              <Text style={styles.text}>
                Введіть Вашу email адресу
              </Text>
              <Text style={styles.text}>
                На неї буде відправлено посилання на сторінку відновлення паролю
              </Text>
              <TextInput
                placeholder="E-mail"
                style={styles.input}
                value={email}
                keyboardType='email-address'
                onChangeText={handleChange}
                onSubmitEditing={handleSendEmail}
                returnKeyType='send'
                onBlur={() => setVisited(true)}
              />
              {visited && !isValidEmail && <Text style={styles.errorText}>Невірний формат</Text>}
              <View style={styles.buttons}>
                <Button
                  onPress={goBack}
                  mode='contained'
                  color={Colors.red}
                  disabled={loading}
                  style={styles.button}>
                  Назад
                </Button>
                <Button
                  onPress={handleSendEmail}
                  mode='contained'
                  color={Colors.blue}
                  disabled={!isValidEmail}
                  loading={loading}
                  style={styles.button}>
                  Відправити
                </Button>
              </View>
            </Surface>
            <ErrorDialog
              visible={!!errorMessage}
              hideDialog={() => setErrorMessage(null)}
              message={errorMessage}
            />
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
  avoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
    height: windowHeight
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
  text: {
    color: Colors.darkBlue,
    paddingTop: 16,
    fontSize: 16,
    textAlign: 'center',
    width: '90%',
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
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 4
  },
  input: {
    marginTop: 32,
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 6,
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
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
