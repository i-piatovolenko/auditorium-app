import {Button, Dialog, Paragraph, Portal} from "react-native-paper";
import {Mode} from "../models/models";
import React, {useState} from "react";
import {modeVar} from "../api/client";
import removeFromLine from "../helpers/queue/removeFromLine";
import WaitDialog from "./WaitDialog";

export default function ConfirmContinueDesiredQueue() {
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    setLoading(true);
    await removeFromLine();
    modeVar(Mode.PRIMARY);
    setLoading(false);
  };

  const handleOk = () => {
    //TODO: handle continue for DESIRED
  };

  return <Portal>
    <Dialog visible={true}>
      <Dialog.Title>Увага!</Dialog.Title>
      <Dialog.Content>
        <Paragraph>Ви отримали аудиторію і можете продовжити стояти в черзі за бажаними аудиторіями. Продовжити?</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={handleLeave}>Покинути чергу</Button>
        <Button onPress={handleOk}>Так</Button>
      </Dialog.Actions>
    </Dialog>
    <WaitDialog visible={loading}/>
  </Portal>
};