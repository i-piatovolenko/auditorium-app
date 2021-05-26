import * as React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {View} from '../../components/Themed';
import {Appbar, Banner, Button, Checkbox, HelperText, TextInput} from 'react-native-paper';
import {useState} from "react";
import useDegrees from "../../hooks/useDegrees";
import useDepartments from "../../hooks/useDepartments";
import Agreement from "./components/Agreement";
import CustomPickerField from "../../components/CustomPicker/CustomPickerField";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {SIGN_UP} from "../../api/operations/mutations/signUp";
import InfoDialog from "../../components/InfoDialog";
import {ErrorCodes, ErrorCodesUa} from "../../models/models";

const currentYear: number = parseInt(moment().format('YYYY'));

const startYearsItems = [
  {name: currentYear, id: currentYear},
  {name: currentYear - 1, id: currentYear - 1},
  {name: currentYear - 2, id: currentYear - 2},
  {name: currentYear - 3, id: currentYear - 3},
];

export default function SignUp({navigation}: any) {
  const [selectedDepartment, setSelectedDepartment] = useState({name: '', id: -1});
  const [selectedDegree, setSelectedDegree] = useState({name: '', id: -1});
  const [selectedStartYear, setSelectedStartYear] = useState({name: '', id: -1});
  const [visible, setVisible] = useState(true);
  const [visibleAgreement, setVisibleAgreement] = useState(false);
  const [visibleBackDialog, setVisibleBackDialog] = useState(false);
  const backMessage = 'Ви дійсно бажаєте повернутись на сторінку входу?\n Введені дані будуть стерті.';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [checkAgreement, setCheckAgreement] = useState(false);
  const degrees = useDegrees();
  const departments = useDepartments(true);

  const [isSignupTouched, setIsSignupTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLastNameValidated, setIsLastNameValidated] = useState<string | null>(null);
  const [isFirstNameValidated, setIsFirstNameValidated] = useState<string | null>(null);
  const [isEmailValidated, setIsEmailValidated] = useState<string | null>(null);
  const [isPhoneValidated, setIsPhoneValidated] = useState<string | null>(null);
  const [isPasswordValidated, setIsPasswordValidated] = useState<string | null>(null);
  const [isPasswordConfirmValidated, setIsPasswordConfirmValidated] = useState<string | null>(null);
  const [isStartYearValidated, setIsStartYearValidated] = useState<string | null>(null);
  const [isDepartmentValidated, setIsDepartmentValidated] = useState<string | null>(null);
  const [isDegreeValidated, setIsDegreeValidated] = useState<string | null>(null);

  const [isStartYearModalVisited, setIsStartYearModalVisited] = useState(false);
  const [isDepartmentModalVisited, setIsDepartmentModalVisited] = useState(false);
  const [isDegreeModalVisited, setIsDegreeModalVisited] = useState(false);

  const [signup, {loading, error}] = useMutation(SIGN_UP);

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

  const checkPasswordValidation = (value: string) => {
    const re = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
    const strongRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    if (!value) {
      return setIsPasswordValidated("Обов'язкове поле");
    }
    if (!re.test(value)) {
      return setIsPasswordValidated("Невірний формат");
    }
    return setIsPasswordValidated(null);
  };

  const checkPasswordConfirmValidation = (value: string) => {
    if (!value) {
      return setIsPasswordConfirmValidated("Обов'язкове поле");
    }
    if (password && passwordConfirm && (password !== passwordConfirm)) {
      return setIsPasswordConfirmValidated('Паролі не співпадають');
    }
    return setIsPasswordConfirmValidated(null);
  };

  const checkStartYearValidation = (value: number) => {
    if (value === -1 && (isStartYearModalVisited || isSignupTouched)) {
      return setIsStartYearValidated("Рік вступу не вибрано");
    }
    return setIsStartYearValidated(null);
  };

  const checkDepartmentValidation = (value: number) => {
    if (value === -1 && (isDegreeModalVisited || isSignupTouched)) {
      return setIsDepartmentValidated("Кафедру не вибрано");
    }
    return setIsDepartmentValidated(null);
  };

  const checkDegreeValidation = (value: number) => {
    if (value === -1 && (isDegreeModalVisited || isSignupTouched)) {
      return setIsDegreeValidated("Навчальний ступінь не вибрано");
    }
    return setIsDegreeValidated(null);
  };

  const handleSubmit = async () => {
    checkLastNameValidation(lastName);
    checkFirstNameValidation(firstName);
    checkEmailValidation(email);
    checkPhoneValidation(phoneNumber);
    checkPasswordValidation(password);
    checkPasswordConfirmValidation(passwordConfirm);
    checkStartYearValidation(selectedStartYear.id);
    checkDepartmentValidation(selectedDepartment.id);
    checkDegreeValidation(selectedDegree.id);

    if (!isLastNameValidated && !isFirstNameValidated && !isEmailValidated && !isPasswordValidated
        && !isPasswordConfirmValidated && !isStartYearValidated && !isDepartmentValidated
        && !isDegreeValidated) {
      try {
        const result = await signup({
          variables: {
            input: {
              lastName: lastName,
              firstName: firstName,
              patronymic: patronymic,
              password: password,
              email: email,
              phoneNumber: phoneNumber,
              department: selectedDepartment.id,
              degree: selectedDegree.id,
              startYear: selectedStartYear.id,
            }
          }
        });
        if (result?.data.login.userErrors?.length) {
          alert(ErrorCodesUa[result?.data.login.userErrors[0].code as ErrorCodes])
        } else {
          // navigation.navigate('Verification')
        }
      } catch (e) {
        alert(e)
      }
    }
  }

  const showAgreement = () => setVisibleAgreement(true);

  const hideAgreement = () => setVisibleAgreement(false);

  const showBackDialog = () => setVisibleBackDialog(true);

  const hideBackDialog = () => setVisibleBackDialog(false);

  const navigateToLogin = () => {
    navigation.goBack();
  };

  const handleBack = () => {
    if (lastName || firstName || patronymic || email || phoneNumber || password || passwordConfirm
        || selectedStartYear.id !== -1 || selectedDepartment.id !== -1 || selectedDegree.id !== -1) {
      showBackDialog();
    } else {
      navigateToLogin();
    }
  };

  const Error = ({validator}: any) => (
    <HelperText type="error" style={{color: '#f91354', height: validator ? 'auto' : 0}}>
      {validator}
    </HelperText>
  );

  return (
    <View style={styles.container}>
      <Appbar style={styles.top}>
        <Appbar.BackAction onPress={handleBack}/>
        <Appbar.Content title='Реєстрація' subtitle='Крок 1 із 3'/>
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
                   underlineColor={!isEmailValidated ? '#ccc' : '#f91354'}
                   onChangeText={text => {
                     setPhoneNumber(text);
                     checkPhoneValidation(text);
                   }}
                   onBlur={() => checkPhoneValidation(phoneNumber)}
                   keyboardType='phone-pad'
        />
        <Error validator={isPhoneValidated}/>
        <TextInput placeholder="Пароль *" style={styles.input}
                   underlineColor={!isPasswordValidated ? '#ccc' : '#f91354'}
                   onChangeText={text => {
                     setPassword(text);
                     checkPasswordValidation(text);
                   }}
                   onBlur={() => checkPasswordValidation(password)}
                   right={<TextInput.Icon name={showPassword ? 'eye' : 'eye-off'} color='#ccc'
                                          onPress={() => setShowPassword(prevState => !prevState)}
                                          forceTextInputFocus={false}
                   />}
                   secureTextEntry={!showPassword}
        />
        <Error validator={isPasswordValidated}/>
        <TextInput placeholder="Повторіть пароль *" style={styles.input}
                   underlineColor={!isPasswordConfirmValidated ? '#ccc' : '#f91354'}
                   onChangeText={text => {
                     setPasswordConfirm(text);
                     checkPasswordConfirmValidation(text);
                   }}
                   onBlur={() => checkPasswordConfirmValidation(passwordConfirm)}
                   right={<TextInput.Icon name={showPassword ? 'eye' : 'eye-off'} color='#ccc'
                                          onPress={() => setShowPassword(prevState => !prevState)}
                                          forceTextInputFocus={false}
                   />}
                   secureTextEntry={!showPassword}
        />
        <Error validator={isPasswordConfirmValidated}/>
        <CustomPickerField selected={selectedStartYear} setSelected={setSelectedStartYear}
                           name='Рік початку навчання' items={startYearsItems}
                           checkValidation={checkStartYearValidation}
                           setIsVisited={setIsStartYearModalVisited}
                           underlineColor={!isStartYearValidated ? '#ccc' : '#f91354'}

        />
        <Error validator={isStartYearValidated}/>
        <CustomPickerField name='Кафедра' selected={selectedDepartment} items={departments}
                           setSelected={setSelectedDepartment}
                           checkValidation={checkDepartmentValidation}
                           setIsVisited={setIsDepartmentModalVisited}
                           underlineColor={!isDepartmentValidated ? '#ccc' : '#f91354'}

        />
        <Error validator={isDepartmentValidated}/>
        <CustomPickerField name='Навчальний ступінь' selected={selectedDegree} items={degrees}
                           setSelected={setSelectedDegree}
                           checkValidation={checkDegreeValidation}
                           setIsVisited={setIsDegreeModalVisited}
                           underlineColor={!isDegreeValidated ? '#ccc' : '#f91354'}

        />
        <Error validator={isDegreeValidated}/>
        <View style={styles.agreement}>
          <Checkbox status={checkAgreement ? 'checked' : 'unchecked'} color='#2b5dff'
                    uncheckedColor='#f91354'
                    onPress={() => {
                      setIsSignupTouched(true);
                      setCheckAgreement(prevState => !prevState);
                    }}/>
          <Text style={{width: '90%'}}>Я прочитав і погоджуюсь з
            <Text style={styles.link} onPress={showAgreement}> умовами користування</Text> сервісом.</Text>
        </View>
      </ScrollView>
      <View style={styles.navButtons}>
        <Button
          onPress={handleSubmit}
          mode='contained' color='#f91354'
          style={styles.signUpButton}
          disabled={!checkAgreement || loading}
          loading={loading}
        >
          Зареєструватися
        </Button>
      </View>
      <Agreement visible={visibleAgreement} hideDialog={hideAgreement}
                 setCheckAgreement={setCheckAgreement}
      />
      <InfoDialog message={backMessage} visible={visibleBackDialog} hideDialog={hideBackDialog}
                  navigateToLogin={navigateToLogin}
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
    marginTop: 16
  },
});