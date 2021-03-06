import * as React from 'react';
import {Dialog, Portal, Button} from 'react-native-paper';
import {Text} from 'react-native';
import Colors from "../constants/Colors";

interface PropTypes {
  visible: boolean;
  hideDialog: () => void;
  message: string;
  buttonText?: string;
  titleText?: string;
}

export default function WarningDialog({
                                        visible, hideDialog, message, buttonText = 'Закрити',
                                        titleText = 'Увага!'
                                      }: PropTypes) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title style={{color: Colors.orange}}>{titleText}</Dialog.Title>
        <Dialog.Content>
          <Text style={{marginBottom: -20}}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>{buttonText}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};