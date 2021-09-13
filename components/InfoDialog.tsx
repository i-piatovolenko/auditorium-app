import * as React from 'react';
import {Paragraph, Dialog, Portal, Button} from 'react-native-paper';

interface PropTypes {
  message: any;
  visible: boolean;
  hideDialog: () => void;
  navigateToLogin?: () => void;
  confirmButton?: boolean
}

export default function InfoDialog({visible, message, hideDialog, navigateToLogin,
                                     confirmButton = false}: PropTypes) {
  return (
      <Portal>
        <Dialog visible={visible} dismissable={false}>
          <Dialog.Title style={{textAlign: 'center'}}>Увага</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={{textAlign: 'center'}}>{message}</Paragraph>
          </Dialog.Content>
          {confirmButton ? (
            <Dialog.Actions>
            <Button onPress={() => {
              hideDialog();
              navigateToLogin && navigateToLogin();
            }} mode='contained'>
              Зрозуміло, я запам'ятав свій номер
            </Button>
          </Dialog.Actions>
          ) : (
            <Dialog.Actions>
            <Button onPress={hideDialog} mode='contained' color='#f91354'
                    style={{width: 70, marginRight: 8}}>
              Ні
            </Button>
            <Button onPress={() => {
              hideDialog();
              navigateToLogin && navigateToLogin();
            }} mode='contained' style={{width: 70}}>
              Так
            </Button>
          </Dialog.Actions>
          )}
        </Dialog>
      </Portal>
  );
};