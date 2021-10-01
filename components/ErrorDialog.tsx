import * as React from 'react';
import {Dialog, Portal, Button} from 'react-native-paper';
import {Text} from 'react-native';
import Colors from "../constants/Colors";

interface PropTypes {
  visible: boolean;
  hideDialog: () => void;
  message?: string;
  buttonText?: string;
}

export default function ErrorDialog({visible, hideDialog, message, buttonText = 'Закрити'}: PropTypes) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog} style={{zIndex: 60}}>
        <Dialog.Title style={{color: Colors.red}}>Упс!</Dialog.Title>
        <Dialog.Content>
          <Text style={{marginBottom: -20}}>{!message ? 'Щось пішло не так' : message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{buttonText}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};