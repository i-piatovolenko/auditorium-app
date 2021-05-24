import * as React from 'react';
import {Dialog, Portal, Button} from 'react-native-paper';
import {Text} from 'react-native';

interface PropTypes {
  visible: boolean;
  hideDialog: () => void;
  message?: string;
}

export default function ErrorDialog({visible, hideDialog, message}: PropTypes) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title style={{color: '#f91354'}}>Упс!</Dialog.Title>
        <Dialog.Content>
          <Text style={{marginBottom: -20}}>{!message ? 'Щось пішло не так' : message}!</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Закрити</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};