import React, {useState} from 'react';
import {StyleSheet, Text, View, Dimensions} from "react-native";
import {Button, Checkbox, Divider, Headline, Modal, Portal, RadioButton} from "react-native-paper";

export type SpecialT = 'with' | 'only' | 'without';

interface PropTypes {
  hideModal: () => void;
  visible: boolean;
  apply: (instruments: number[] | null, withWing: boolean, operaStudioOnly: boolean, special: SpecialT) => void;
}

const windowWidth = Dimensions.get('window').width;

export default function Filters({hideModal, visible, apply}: PropTypes) {
  const [instruments, setInstruments] = useState<string | null>(null);
  const [special, setSpecial] = useState<string>('with');
  const [withWing, setWithWing] = useState(false);

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <View style={styles.header}>
        <Headline>Фільтри аудиторій для черги</Headline>
      </View>
      <View style={styles.body}>
        <Button icon='pencil'>Будь-які інструменти</Button>
        <Divider style={styles.divider}/>
        <View style={styles.checkbox}>
          <Checkbox status={withWing ? 'checked' : 'unchecked'}
                    onPress={() => setWithWing(prevState => !prevState)}/>
          <Text>Без флігеля</Text>
        </View>
        <View style={styles.checkbox}>
          <Checkbox status={'unchecked'}/>
          <Text>Тільки оперна студія</Text>
        </View>
        <Divider style={styles.divider}/>
        <RadioButton.Group onValueChange={newValue => setSpecial(newValue)} value={special}>
          <View style={styles.radioItem}>
            <RadioButton value='with' />
            <Text>Зі спеціалізованими (ф-но)</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value='only' />
            <Text>Тільки спеціалізовані (ф-но)</Text>
          </View>
          <View style={styles.radioItem}>
            <RadioButton value='without' />
            <Text>Без спеціалізованих (ф-но)</Text>
          </View>
        </RadioButton.Group>
        <Divider style={styles.divider}/>
        <View style={styles.buttons}>
          <Button mode='contained'>Збережені фільтри</Button>
          <Button mode='contained'>Застосувати</Button>
        </View>
      </View>
    </Modal>
  </Portal>
};

const styles = StyleSheet.create(({
  containerStyle: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    width: '100%',
    backgroundColor: '#f1f1f1'
  },
  body: {
    padding: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  divider: {
    borderBottomColor: '#eee',
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    width: windowWidth - 80,
    height: 1,
    marginVertical: 16
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}));