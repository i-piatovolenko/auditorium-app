import React from 'react';
import {Button, Dialog, Portal} from "react-native-paper";
import {ScrollView, Text} from "react-native";

interface PropTypes {
  visible: boolean;
  hideDialog: () => void;
  setCheckAgreement: (value: boolean) => void;
}

export default function Agreement({visible, hideDialog, setCheckAgreement}: PropTypes) {
  return <Portal>
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>Умови користування</Dialog.Title>
      <Dialog.Content>
        <ScrollView style={{height: '80%'}}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A delectus explicabo odit officia unde? Asperiores
            consequatur, deleniti, deserunt ducimus eveniet fuga minima minus neque placeat qui quia sed temporibus
            voluptatem.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid error excepturi id quibusdam quod sed.
            Aperiam aspernatur doloremque ea enim incidunt, molestiae nam nesciunt non, perferendis perspiciatis
            possimus
            quidem, quo!
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis deleniti doloribus earum expedita id illum
            ipsum modi, natus nesciunt numquam odit officia porro quisquam quod quos tempore totam veniam veritatis.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam atque doloribus eius error est expedita
            harum id labore libero minus molestiae nisi officiis qui quod, ratione similique sit tempore ullam.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A delectus explicabo odit officia unde? Asperiores
            consequatur, deleniti, deserunt ducimus eveniet fuga minima minus neque placeat qui quia sed temporibus
            voluptatem.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid error excepturi id quibusdam quod sed.
            Aperiam aspernatur doloremque ea enim incidunt, molestiae nam nesciunt non, perferendis perspiciatis
            possimus
            quidem, quo!
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis deleniti doloribus earum expedita id illum
            ipsum modi, natus nesciunt numquam odit officia porro quisquam quod quos tempore totam veniam veritatis.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam atque doloribus eius error est expedita
            harum id labore libero minus molestiae nisi officiis qui quod, ratione similique sit tempore ullam.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A delectus explicabo odit officia unde? Asperiores
            consequatur, deleniti, deserunt ducimus eveniet fuga minima minus neque placeat qui quia sed temporibus
            voluptatem.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid error excepturi id quibusdam quod sed.
            Aperiam aspernatur doloremque ea enim incidunt, molestiae nam nesciunt non, perferendis perspiciatis
            possimus
            quidem, quo!
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis deleniti doloribus earum expedita id illum
            ipsum modi, natus nesciunt numquam odit officia porro quisquam quod quos tempore totam veniam veritatis.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam atque doloribus eius error est expedita
            harum id labore libero minus molestiae nisi officiis qui quod, ratione similique sit tempore ullam.
          </Text>
        </ScrollView>
      </Dialog.Content>
      <Dialog.Actions style={{height: 20}}>
        <Button onPress={() => {
          hideDialog();
          setCheckAgreement(false);
        }} style={{height: 20}}>Відхилити</Button>
        <Button onPress={() => {
          hideDialog();
          setCheckAgreement(true);
        }} style={{height: 20}}>Прийняти</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
}