import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {ColorSchemeName, StyleSheet} from 'react-native';
import {RootStackParamList} from '../types';
import Login from "../screens/Login";
import SignUp from "../screens/Signup/SignUp";
import ForgotPassword from "../screens/ForgotPassword";
import ForgotPasswordSuccess from "../screens/ForgotPasswordSuccess";
import {createDrawerNavigator} from "@react-navigation/drawer";
import Users from "../screens/Users";
import CustomSidebarMenu from "./CustomSidebarMenu";
import Schedule from "../screens/Schedule";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import {getItem} from "../api/asyncStorage";
import {AccountStatuses, User} from "../models/models";
import SignUpStepTwo from "../screens/Signup/SignUpStepTwo";
import Verification from "../screens/Signup/Verification";
import Home from "../screens/ClassroomsList/ClassroomsList";
import {meVar} from "../api/client";
import {useQuery} from "@apollo/client";
import {GET_ME} from "../api/operations/queries/me";
import Frozen from "../screens/Signup/Frozen";
import Loading from "../screens/Loading";
import * as SplashScreen from "expo-splash-screen";
import Splash from "../screens/Splash";
import PrivacyPolicy from "../screens/PrivacyPolicy";

export default function Navigation({colorScheme}: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator/>
    </NavigationContainer>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator<RootStackParamList>();


function RootNavigator() {
  const [accountStatus, setAccountStatus] = useState<AccountStatuses | null>(null);
  const {data: {me}} = useQuery(GET_ME);
  const [appIsReady, setAppIsReady] = useState(false);

  const getAccountStatus = (user: User) => {
    //@ts-ignore
    const {studentInfo, employeeInfo} = user;

    const isStudent = !!studentInfo;
    const status = isStudent ? studentInfo?.accountStatus : employeeInfo?.accountStatus;
    setAccountStatus(status);
  }

  const getMe = async () => {
    if (!me) {
      try {
        const user: User | undefined = await getItem('user')
        if (user) {
          getAccountStatus(user);
          meVar(user);
        } else {
        }
      } catch (e) {
        alert(JSON.stringify(e));
      }
    } else {
      getAccountStatus(me);
    }
  }

  useEffect(() => {
    getMe();
  }, [me]);

  const checkStatus = ((accountStatus: AccountStatuses) => {
    switch (accountStatus) {
      case AccountStatuses.UNVERIFIED:
        return Verification;
      case AccountStatuses.FROZEN:
      case AccountStatuses.ACADEMIC_LEAVE:
        return Frozen;
      case AccountStatuses.ACTIVE:
        return Home;
      default:
        return Loading;
    }
  });


  useEffect(() => {
    async function prepare() {
      try {
        await getMe();
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

 return (
    me ? <Drawer.Navigator initialRouteName="Home" drawerStyle={styles.drawer} drawerContentOptions={{
        activeBackgroundColor: '#2b5dff',
        labelStyle: {
          fontSize: 20,
          color: '#fff'
        },
      }}
                           drawerContent={(props: any) => <CustomSidebarMenu {...props}/>}
      >
        <Drawer.Screen name="Home"
          //TODO set !== to ===
                       component={checkStatus(accountStatus as AccountStatuses)}
                       options={{
                         title: 'Аудиторії',
                       }}
                       initialParams={{id: meVar()?.id}}
        />
        <Drawer.Screen name="Users" component={Users} options={{
          title: 'Довідник',
        }}/>
        {/*<Drawer.Screen name="Schedule" component={Schedule} options={{*/}
        {/*  title: 'Розклад'*/}
        {/*}}/>*/}
        <Drawer.Screen name="Profile" component={Profile} options={{
          title: 'Мій профіль'
        }}/>
        <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{
          title: 'Політика конфіденційності'
        }}/>
      </Drawer.Navigator>
      : <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={appIsReady ? Login : Splash}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
        />
        <Stack.Screen
          name="SignUpStepTwo"
          component={SignUpStepTwo}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
        />
        <Stack.Screen
          name="ForgotPasswordSuccess"
          component={ForgotPasswordSuccess}
        />
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#2e287c',
  }
});
