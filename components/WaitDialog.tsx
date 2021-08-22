import * as React from 'react';
import {Paragraph, Dialog, Portal, ProgressBar} from 'react-native-paper';

interface PropTypes {
  message?: string;
  visible: boolean;
}

export default function WaitDialog({visible, message}: PropTypes) {
  return (
      <Portal>
        <Dialog visible={visible} dismissable={false}>
          <Dialog.Title style={{textAlign: 'center'}}>Зачекайте, будь ласка!</Dialog.Title>
          <Dialog.Content>
            {message && <Paragraph style={{textAlign: 'center'}}>{message}</Paragraph>}
            <ProgressBar indeterminate style={{marginTop: 16}}/>
          </Dialog.Content>
        </Dialog>
      </Portal>
  );
};