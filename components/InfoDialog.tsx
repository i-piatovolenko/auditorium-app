import * as React from 'react';
import {Paragraph, Dialog, Portal, Button} from 'react-native-paper';

interface PropTypes {
  message: string;
  visible: boolean;
  hideDialog: () => void;
  navigateToLogin: () => void;
}

export default function InfoDialog({visible, message, hideDialog, navigateToLogin}: PropTypes) {
  return (
      <Portal>
        <Dialog visible={visible} dismissable={false}>
          <Dialog.Title style={{textAlign: 'center'}}>Увага</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{textAlign: 'center'}}>{message}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} mode='contained' color='#f91354'
                    style={{width: 70, marginRight: 8}}>
              Ні
            </Button>
            <Button onPress={() => {
              hideDialog();
              navigateToLogin();
            }} mode='contained' style={{width: 70}}>
              Так
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
  );
};