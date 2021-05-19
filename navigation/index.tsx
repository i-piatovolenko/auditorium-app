import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {ColorSchemeName, StyleSheet} from 'react-native';
import {RootStackParamList} from '../types';
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Verification from "../screens/Verification";
import ForgotPassword from "../screens/ForgotPassword";
import ForgotPasswordSuccess from "../screens/ForgotPasswordSuccess";
import {useLocal} from "../hooks/useLocal";
import {createDrawerNavigator} from "@react-navigation/drawer";
import Home from "../screens/ClassroomsList";
import Users from "../screens/Users";
import CustomSidebarMenu from "./CustomSidebarMenu";
import Schedule from "../screens/Schedule";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";

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
        <Drawer.Screen name="Home" component={Home} options={{
          title: 'Аудиторії',
        }}/>
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
        <Drawer.Screen name="Users4" component={Users} options={{
          title: 'Вийти'
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
          name="Verification"
          component={Verification}
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
