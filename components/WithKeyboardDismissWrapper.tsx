import React from 'react';
import { Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import {Platforms} from "../models/models";

type PropTypes = {}
//@ts-ignore
const WithKeyboardDismissWrapper: React.FC<PropTypes> = ({children}) => {
  if (Platform.OS === Platforms.WEB) return children;
  return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
}

export default WithKeyboardDismissWrapper;