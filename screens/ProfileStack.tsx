import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "../types";
import Profile from "./Profile";
import UpdatePassword from "./UpdatePassword";

const Stack = createStackNavigator<RootStackParamList>();

function ProfileStack() {
  // @ts-ignore
  return <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Profile'>
    <Stack.Screen
      name={'Profile' as any}
      component={Profile}
    />
    <Stack.Screen
      name={'UpdatePassword' as any}
      component={UpdatePassword}
    />
    <Stack.Screen
      name={'UpdatePasswordSuccess' as any}
      component={UpdatePassword}
    />
  </Stack.Navigator>
}

export default ProfileStack;