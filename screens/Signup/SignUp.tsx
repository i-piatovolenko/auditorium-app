import * as React from 'react';
import {useEffect, useState} from 'react';
import {Dimensions, ImageBackground, ScrollView, StyleSheet, Text} from 'react-native';
import {View} from '../../components/Themed';
import {Appbar, Banner, Button, HelperText, TextInput} from 'react-native-paper';
import CheckBox from 'react-native-check-box'
import Agreement from "./components/Agreement";
import CustomPickerField from "../../components/CustomPicker/CustomPickerField";
import moment from "moment";
import {useMutation} from "@apollo/client";
import {SIGN_UP} from "../../api/operations/mutations/signUp";
import InfoDialog from "../../components/InfoDialog";
import {ErrorCodes, ErrorCodesUa} from "../../models/models";
import {GET_UNSIGNED_DEPARTMENTS} from "../../api/operations/queries/unsignedDepartments";
import {client} from "../../api/client";
import {GET_UNSIGNED_DEGREES} from "../../api/operations/queries/unsignedDegrees";
import {
  EMAIL_VALID,
  ONLY_CYRILLIC,
  ONLY_DIGITS,
  PASSWORD_SOFT_VALID,
  validationErrors
} from "../../helpers/validators";
import Colors from "../../constants/Colors";

const currentYear: number = parseInt(moment().format('YYYY'));

const startYearsItems = [
  {name: currentYear, id: currentYear},
  {name: currentYear - 1, id: currentYear - 1},
  {name: currentYear - 2, id: currentYear - 2},
  {name: currentYear - 3, id: currentYear - 3},
];

const windowHeight = Dimensions.get('window').height;
const PHONE_PREFIX = '+380';


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
  const [departments, setDepartments] = useState([{id: -1, name: 'DEFAULT_DEPARTMENT'}]);
  const [degrees, setDegrees] = useState([{id: -1, name: 'DEFAULT_DEGREE'}]);

  const [isSignupTouched, setIsSignupTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPatronymicHint, setShowPatronymicHint] = useState(false);

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

  useEffect(() => {
    client.query({
      query: GET_UNSIGNED_DEPARTMENTS,
      fetchPolicy: 'network-only',
    }).then(({data}) => {
      setDepartments(data.signupDepartments);
    });
    client.query({
      query: GET_UNSIGNED_DEGREES,
      fetchPolicy: 'network-only',
    }).then(({data}) => {
      setDegrees(data.signupDegrees);
    });
  }, []);

  const checkLastNameValidation = (value: string) => {
    if (!ONLY_CYRILLIC.test(value)) {
      return setIsLastNameValidated(validationErrors.ONLY_CYRILLIC);
    }
    if (!value) {
      return setIsLastNameValidated(validationErrors.REQUIRED_FIELD);
    }
    return setIsLastNameValidated(null);
  };

  const checkFirstNameValidation = (value: string) => {
    if (!ONLY_CYRILLIC.test(value)) {
      return setIsLastNameValidated(validationErrors.ONLY_CYRILLIC);
    }
    if (!value) {
      return setIsFirstNameValidated(validationErrors.REQUIRED_FIELD);
    }
    return setIsFirstNameValidated(null);
  };

  const checkEmailValidation = (value: string) => {
    if (!value) {
      return setIsEmailValidated(validationErrors.REQUIRED_FIELD);
    }
    if (!EMAIL_VALID.test(value)) {
      return setIsEmailValidated(validationErrors.INVALID_FORMAT);
    }
    return setIsEmailValidated(null);
  };

  const checkPhoneValidation = (value: string) => {
    if (!value) {
      return setIsPhoneValidated(validationErrors.REQUIRED_FIELD);
    }
    if (!ONLY_DIGITS.test(value) || value.length !== 9) {
      return setIsPhoneValidated(validationErrors.INVALID_FORMAT);
    }
    return setIsPhoneValidated(null);
  };

  const checkPasswordValidation = (value: string) => {
    if (!value) {
      return setIsPasswordValidated(validationErrors.REQUIRED_FIELD);
    }
    if (!PASSWORD_SOFT_VALID.test(value)) {
      return setIsPasswordValidated(validationErrors.INVALID_PASSWORD);
    }
    return setIsPasswordValidated(null);
  };

  const checkPasswordConfirmValidation = (value: string) => {
    if (!value) {
      return setIsPasswordConfirmValidated(validationErrors.REQUIRED_FIELD);
    }
    if (password && passwordConfirm && (password !== value)) {
      return setIsPasswordConfirmValidated(validationErrors.PASSWORDS_NOT_SAME);
    }
    return setIsPasswordConfirmValidated(null);
  };

  const checkStartYearValidation = (value: number) => {
    if (value === -1 && (isStartYearModalVisited || isSignupTouched)) {
      return setIsStartYearValidated(validationErrors.NO_START_YEAR);
    }
    return setIsStartYearValidated(null);
  };

  const checkDepartmentValidation = (value: number) => {
    if (value === -1 && (isDegreeModalVisited || isSignupTouched)) {
      return setIsDepartmentValidated(validationErrors.NO_DEPARTMENT);
    }
    return setIsDepartmentValidated(null);
  };

  const checkDegreeValidation = (value: number) => {
    if (value === -1 && (isDegreeModalVisited || isSignupTouched)) {
      return setIsDegreeValidated(validationErrors.NO_DEGREE);
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
              phoneNumber: PHONE_PREFIX + phoneNumber,
              departmentId: selectedDepartment.id,
              degreeId: selectedDegree.id,
              startYear: selectedStartYear.id,
            }
          }
        });
        const hasErrors = result?.data.signup.userErrors?.length;
        if (hasErrors) {
          const errorMessage = ErrorCodesUa[result?.data.signup.userErrors[0].code as ErrorCodes];
          alert(errorMessage);
        } else {
          navigation.navigate('SignUpStepTwo');
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
    <ImageBackground source={require('../../assets/images/bg.jpg')}
                     style={{width: '100%', height: '100%'}}>
      <View style={styles.container}>
        <Appbar style={styles.top}>
          <Appbar.BackAction onPress={handleBack} color='#fff'/>
          <Appbar.Content title='Реєстрація' subtitle='Крок 1 із 3' color='#fff'/>
        </Appbar>
        <View style={styles.wrapper}>
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
              Співробітники академії можуть без реєстрації отримати дані свого облікового запису, вказавши диспетчеру свій email.            </Banner>
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
                       onBlur={() => {
                         checkFirstNameValidation(firstName);
                         setShowPatronymicHint(true);
                       }}
            />
            <Error validator={isFirstNameValidated}/>
            {showPatronymicHint && <Text style={styles.infoPanel}>
              Поле 'По-батькові' обов'язково для не іноземців
            </Text>}
            <TextInput
              placeholder="По-батькові"
              style={styles.input}
              value={patronymic}
              onBlur={() => setShowPatronymicHint(false)}
              onChangeText={text => setPatronymic(text)}
            />
            <View style={{height: 10, backgroundColor: '#fff'}}/>
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
            <View style={styles.phoneInputWrapper}>
              <Text style={styles.phonePrefix}>{PHONE_PREFIX}</Text>
              <TextInput placeholder="Тел. номер *" style={styles.phoneInput}
                         underlineColor={!isEmailValidated ? '#ccc' : '#f91354'}
                         onChangeText={text => {
                           setPhoneNumber(text);
                           checkPhoneValidation(text);
                         }}
                         onBlur={() => checkPhoneValidation(phoneNumber)}
                         keyboardType='phone-pad'
              />
            </View>
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
              <CheckBox
                isChecked={checkAgreement}
                onClick={() => {
                  setIsSignupTouched(true);
                  setCheckAgreement(prevState => !prevState);
                }}
                style={{paddingRight: 8}}
              />
              <Text style={{width: '90%', backgroundColor: '#fff'}}>Я прочитав і погоджуюсь з
                <Text style={styles.link} onPress={showAgreement}> політикою конфіденційності</Text> *</Text>
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent'
  },
  wrapper: {
    backgroundColor: '#fff',
    width: '100%',
    height: windowHeight - 80,
    alignItems: 'center',
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
  },
  scrollView: {
    width: '90%',
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    fontSize: 22,
    paddingLeft: 10,
    margin: 0,
  },
  phoneInput: {
    width: '100%',
    backgroundColor: 'transparent',
    fontSize: 22,
    paddingLeft: 40,
    margin: 0,
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: 'transparent',
    elevation: 0
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
    backgroundColor: '#fff',
  },
  infoPanel: {
    borderRadius: 8,
    backgroundColor: '#b5e3ff',
    padding: 8,
    marginTop: 16
  },
  phoneInputWrapper: {
    backgroundColor: Colors.light.background,
    flexDirection: 'row',
    alignItems: 'center'
  },
  phonePrefix: {
    fontSize: 21,
    color: Colors.lightGrey,
    position: 'absolute'
  }
});