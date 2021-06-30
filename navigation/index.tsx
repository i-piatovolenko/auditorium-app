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
import {useLocal} from "../hooks/useLocal";
import {createDrawerNavigator} from "@react-navigation/drawer";
import Users from "../screens/Users";
import CustomSidebarMenu from "./CustomSidebarMenu";
import Schedule from "../screens/Schedule";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import {getItem} from "../api/asyncStorage";
import {AccountStatuses, User} from "../models/models";
import {isLoggedVar} from "../api/client";
import SignUpStepTwo from "../screens/Signup/SignUpStepTwo";
import Verification from "../screens/Signup/Verification";
import Home from "../screens/ClassroomsList/ClassroomsList";

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
  const {data: {isLogged}} = useLocal('isLogged');
  const [user, setUser] = useState<User | null>(null);
  const [accountStatus, setAccountStatus] = useState<AccountStatuses>(AccountStatuses.UNVERIFIED);

  useEffect(() => {
      try {
        getItem('user').then(user => {
          setUser(user as unknown as User);
        }).then(() => {
          if (user) {
            const {studentInfo, employeeInfo} = user;
            isLoggedVar(true);

            const isStudent = !!studentInfo;
            const status = isStudent ? studentInfo.accountStatus : employeeInfo.accountStatus;

            setAccountStatus(status);
          }
        });
      } catch (e) {
        alert(e);
      }
    }, []);

  return (
    isLogged
      ? <Drawer.Navigator initialRouteName="Home" drawerStyle={styles.drawer} drawerContentOptions={{
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
                       component={accountStatus !== AccountStatuses.UNVERIFIED ?
                         Verification : Home} options={{
          title: 'Аудиторії',
        }}
        initialParams={{id: user?.id}}
        />
        <Drawer.Screen name="Users" component={Users} options={{
          title: 'Довідник',
        }}/>
        <Drawer.Screen name="Schedule" component={Schedule} options={{
          title: 'Розклад'
        }}/>
        <Drawer.Screen name="Profile" component={Profile} options={{
          title: 'Мій профіль'
        }}/>
        <Drawer.Screen name="Settings" component={Settings} options={{
          title: 'Налаштування'
        }}/>
      </Drawer.Navigator>
      : <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
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
