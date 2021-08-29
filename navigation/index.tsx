import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Alert, AppState, AppStateStatus, BackHandler, ColorSchemeName, StyleSheet} from 'react-native';
import {RootStackParamList} from '../types';
import Login from "../screens/Login";
import SignUp from "../screens/Signup/SignUp";
import ForgotPassword from "../screens/ForgotPassword";
import ForgotPasswordSuccess from "../screens/ForgotPasswordSuccess";
import {createDrawerNavigator} from "@react-navigation/drawer";
import Users from "../screens/Users";
import CustomSidebarMenu from "./CustomSidebarMenu";
import Profile from "../screens/Profile";
import {getItem} from "../api/asyncStorage";
import Home from "../screens/ClassroomsList/ClassroomsList";
import {meVar} from "../api/client";
import * as SplashScreen from "expo-splash-screen";
import Splash from "../screens/Splash";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import {useLocal} from "../hooks/useLocal";

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
  const [currentUser, setCurrentUser] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const {data: {me}} = useLocal('me');

  useEffect(() => {

    async function prepare() {
      try {
        const user = await getItem('user');
        if (user) {
          setCurrentUser(user);
          meVar(user);
        }
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();

    const backAction = () => {
      Alert.alert('Увага!', 'Ви дійсно хочете вийти з додатку?', [
        {
          text: 'Ні',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Так', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
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
                       component={Home}
                       options={{
                         title: 'Аудиторії',
                       }}
                       initialParams={{id: me.id}}
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
      : <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={"Login" as any}>
        <Stack.Screen
          name={"Login" as any}
          component={appIsReady ? Login : Splash}
        />
        <Stack.Screen
          name={"SignUp" as any}
          component={SignUp}
        />
        <Stack.Screen
          name={"ForgotPassword" as any}
          component={ForgotPassword}
        />
        <Stack.Screen
          name={"ForgotPasswordSuccess" as any}
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
