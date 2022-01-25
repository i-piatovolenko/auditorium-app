import {Button, Dialog, Paragraph, Portal} from "react-native-paper";
import {Mode} from "../models/models";
import React, {useState} from "react";
import removeFromLine from "../helpers/queue/removeFromLine";
import WaitDialog from "./WaitDialog";
import {modeVar} from "../api/localClient";

interface PropTypes {
  hideDialog: () => void;
  visible: boolean;
}

export default function ConfirmLineOut({hideDialog, visible}: PropTypes) {
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    setLoading(true);
    await removeFromLine();
    modeVar(Mode.PRIMARY);
    setLoading(false);
    hideDialog();
  };

  return <Portal>
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>Увага!</Dialog.Title>
      <Dialog.Content>
        <Paragraph>Ви дійсно бажаєте покинути чергу? Цю дію неможливо буде відмінити.</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={hideDialog}>Ні</Button>
        <Button onPress={handleOk}>Так</Button>
      </Dialog.Actions>
    </Dialog>
    <WaitDialog visible={loading}/>
  </Portal>
};
