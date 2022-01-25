import * as React from 'react';
import {Paragraph, Dialog, Portal, Button} from 'react-native-paper';
import {client} from "../api/client";
import {MAKE_DECISION_ON_QUEUE_RESERVED} from "../api/operations/mutations/returnToQueue";
import {globalErrorVar} from "../api/localClient";

type PropTypes = {
  remainingOccupationTime: number;
}

const ReturnToQueueDialog: React.FC<PropTypes> = ({remainingOccupationTime}) => {
  const handleReturnToQueue = async (value: boolean) => {
    try {
      await client.mutate({
        mutation: MAKE_DECISION_ON_QUEUE_RESERVED,
        variables: {
          input: {
            returnToQueue: value
          }
        }
      });
    } catch (e: any) {
      globalErrorVar(e.message);
    }
  };

  return (
    <Portal>
      <Dialog visible dismissable={false}>
        <Dialog.Title style={{textAlign: 'center'}}>
          Увага! Ви були достроково виписані з аудиторії.
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph style={{textAlign: 'center'}}>
            Ви можете повернутись до черги на те місце, на якому ви її залишили.
          </Paragraph>
          {remainingOccupationTime && (
            <Paragraph style={{textAlign: 'center'}}>
              Час, що залишився для занять: {remainingOccupationTime / 1000 / 60} хв.
            </Paragraph>
          )}
          <Paragraph style={{textAlign: 'center'}}>
            Ви бажаєте повернутись до черги?
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions style={{flexDirection: 'column'}}>
          <Button onPress={() => handleReturnToQueue(false)} mode='contained' color='#f91354'
                  style={{marginHorizontal: 16, marginBottom: 8, width: '100%'}}>
            Вийти з черги
          </Button>
          <Button onPress={() => handleReturnToQueue(true)} mode='contained'
                  style={{marginHorizontal: 16, width: '100%'}}>
            Повернутись до черги
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ReturnToQueueDialog;
