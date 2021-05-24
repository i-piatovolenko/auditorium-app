import * as React from 'react';
import {Picker, ScrollView, StyleSheet, Keyboard, Text} from 'react-native';
import {View} from '../../components/Themed';
import {Appbar, Banner, Button, Checkbox, HelperText, IconButton, TextInput} from 'react-native-paper';
import {useEffect, useState} from "react";
import useDegrees from "../../hooks/useDegrees";
import useDepartments from "../../hooks/useDepartments";
import Agreement from "./components/Agreement";
import CustomPickerField from "../../components/CustomPicker/CustomPickerField";

export default function SignUp({navigation}: any) {
  const [selectedDepartment, setSelectedDepartment] = useState({name: '', id: -1});
  const [selectedDegree, setSelectedDegree] = useState({name: '', id: -1});
  const [visible, setVisible] = useState(true);
  const [visibleAgreement, setVisibleAgreement] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [startYear, setStartYear] = useState('');
  const [checkAgreement, setCheckAgreement] = useState(false);
  const degrees = useDegrees();
  const departments = useDepartments(true);
  const [isSignupTouched, setIsSignupTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLastNameValidated, setIsLastNameValidated] = useState<string | null>(null);
  const [isFirstNameValidated, setIsFirstNameValidated] = useState<string | null>(null);
  const [isEmailValidated, setIsEmailValidated] = useState<string | null>(null);
  const [isPhoneValidated, setIsPhoneValidated] = useState<string | null>(null);

  const checkLastNameValidation = (value: string) => {
    if (!value) {
      return setIsLastNameValidated("Обов'язкове поле");
    }
    return setIsLastNameValidated(null);
  };

  const checkFirstNameValidation = (value: string) => {
    if (!value) {
      return setIsFirstNameValidated("Обов'язкове поле");
    }
    return setIsFirstNameValidated(null);
  };

  const checkEmailValidation = (value: string) => {
    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    if (!value) {
      return setIsEmailValidated("Обов'язкове поле");
    }
    if (!re.test(value)) {
      return setIsEmailValidated("Невірний формат");
    }
    return setIsEmailValidated(null);
  };

  const checkPhoneValidation = (value: string) => {
    const re = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/

    if (!value) {
      return setIsPhoneValidated("Обов'язкове поле");
    }
    if (!re.test(value)) {
      return setIsPhoneValidated("Невірний формат");
    }
    return setIsPhoneValidated(null);
  };

  const handleSubmit = () => {
    // navigation.navigate('Verification')
    setIsSignupTouched(true);
  }

  const showAgreement = () => setVisibleAgreement(true);

  const hideAgreement = () => setVisibleAgreement(false);

  const Error = ({validator}: any) => (
    <HelperText type="error" style={{color: '#f91354', height: validator ? 'auto' : 0}}>
      {validator}
    </HelperText>
  );

  return (
    <View style={styles.container}>
      <Appbar style={styles.top}>
        <Appbar.BackAction onPress={() => navigation.goBack()}/>
        <Appbar.Content title="Реєстрація"/>
      </Appbar>
      <ScrollView style={styles.scrollView}>
        <Banner
          icon='alert-circle'
          visible={visible}
          actions={[
            {
              label: 'Зрозуміло',
              onPress: () => setVisible(false),
            }
          ]}
        >
          Реєстрація педагогів та співробітників навчального закладу відбувається за допомогою диспетчера.
        </Banner>
        <Text style={styles.infoPanel}>
          Введіть дані, що співпадають з вашим студентським квитком або іншим документом.
        </Text>
        <TextInput placeholder="Прізвище *" style={styles.input} value={lastName}
                   underlineColor={!isLastNameValidated ? '#ccc' : '#f91354'}
                   onChangeText={text => {
                     setLastName(text);
                     checkLastNameValidation(text);
                   }}
                   onBlur={() => checkLastNameValidation(lastName)}
        />
        <Error validator={isLastNameValidated}/>
        <TextInput placeholder="Ім'я *" style={styles.input} value={firstName}
                   underlineColor={!isFirstNameValidated ? '#ccc' : '#f91354'}

                   onChangeText={text => {
                     setFirstName(text);
                     checkFirstNameValidation(text);
                   }}
                   onBlur={() => checkFirstNameValidation(firstName)}
        />
        <Error validator={isFirstNameValidated}/>
        <TextInput placeholder="По-батькові" style={styles.input} value={patronymic}
                   onChangeText={text => setPatronymic(text)}
        />
        <TextInput placeholder="E-mail *" style={styles.input} value={email}
                   underlineColor={!isEmailValidated ? '#ccc' : '#f91354'}
                   onChangeText={text => {
                     setEmail(text);
                     checkEmailValidation(text);
                   }}
                   onBlur={() => checkEmailValidation(email)}
                   keyboardType='email-address'
        />
        <Error validator={isEmailValidated}/>
        <TextInput placeholder="Тел. номер *" style={styles.phoneInput}
                   onChangeText={text => {
                     setPhoneNumber(text);
                     checkPhoneValidation(text);
                   }}
                   keyboardType='phone-pad'
        />
        <Error validator={isEmailValidated}/>
        <TextInput placeholder="Пароль *" style={styles.input}
                   onChangeText={text => setPassword(text)}
                   right={<TextInput.Icon name={showPassword ? 'eye' : 'eye-off'} color='#ccc'
                                          onPress={() => setShowPassword(prevState => !prevState)}
                                          forceTextInputFocus={false}
                   />}
                   secureTextEntry={showPassword}
        />
        <Error value={phoneNumber} name='password'/>
        <TextInput placeholder="Повторіть пароль *" style={styles.input}
                   onChangeText={text => setPasswordConfirm(text)}
                   right={<TextInput.Icon name={showPassword ? 'eye' : 'eye-off'} color='#ccc'
                                          onPress={() => setShowPassword(prevState => !prevState)}
                                          forceTextInputFocus={false}
                   />}
                   secureTextEntry={showPassword}
        />
        <Error value={phoneNumber} name='passwordConfirm'/>
        <TextInput placeholder="Рік початку" style={styles.input} keyboardType='numeric'
                   value={startYear}
                   onChangeText={text => setStartYear(text)}
        />
        <CustomPickerField name='Кафедра' selected={selectedDepartment} items={departments}
                           setSelected={setSelectedDepartment}/>
        <CustomPickerField name='Навчальний ступінь' selected={selectedDegree} items={degrees}
                           setSelected={setSelectedDegree}/>
        <View style={styles.agreement}>
          <Checkbox status={checkAgreement ? 'checked' : 'unchecked'} color='#2b5dff'
                    uncheckedColor='#f91354'
                    onPress={() => setCheckAgreement(prevState => !prevState)}/>
          <Text style={{width: '90%'}}>Я прочитав і погоджуюсь з
            <Text style={styles.link} onPress={showAgreement}> умовами користування</Text> сервісом.</Text>
        </View>
      </ScrollView>
      <View style={styles.navButtons}>
        <Button
          onPress={handleSubmit}
          mode='contained' color='#f91354'
          style={styles.signUpButton}
          disabled={!checkAgreement}
        >
          Зареєструватися
        </Button>
      </View>
      <Agreement visible={visibleAgreement} hideDialog={hideAgreement}
                 setCheckAgreement={setCheckAgreement}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  navButtons: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 16,
  },
  signUpButton: {
    height: 50,
    justifyContent: 'center',
    width: '90%',
  },
  scrollView: {
    width: '90%',
    marginTop: 80,
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    fontSize: 22,
    paddingLeft: 10,
    margin: 0,
  },
  phoneNumbers: {
    backgroundColor: 'transparent'
  },
  phoneRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    backgroundColor: 'transparent',
    height: 50,
    fontSize: 22,
    flex: 1,
    paddingLeft: 10,
    marginTop: 16,
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: '#2e287c',
  },
  link: {
    color: '#2b5dff',
    textDecorationLine: 'underline'
  },
  agreement: {
    paddingTop: 20,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoPanel: {
    borderRadius: 8,
    backgroundColor: '#b5e3ff',
    padding: 8,
    margin: 8
  },
});
