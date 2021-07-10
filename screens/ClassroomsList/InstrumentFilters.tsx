import React, {useState} from 'react';
import {StyleSheet, Text, View, Dimensions, ScrollView} from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  TextInput
} from "react-native-paper";
import {InstrumentType} from "../../models/models";
import InstrumentsList from "./InstrumentsList";

export type SpecialT = 'with' | 'only' | 'without';

interface PropTypes {
  hideModal: () => void;
  visible: boolean;
  instruments: InstrumentType[];
  setInstruments: any;
}

const windowWidth = Dimensions.get('window').width;

export default function InstrumentFilters({hideModal, visible, instruments, setInstruments}: PropTypes) {
  const [isGrandPianoOnly, setIsGrandPianoOnly] = useState(false);
  const [count, setCount] = useState(0);
  const [visibleList, setVisibleList] = useState(false);


  const showModalList = () => setVisibleList(true);

  const hideModalList = () => setVisibleList(false);

  const addInstrument = () => {
    const newInstrument = {type: isGrandPianoOnly ? 'GrandPiano' : 'UpRightPiano', rate: count};

    setInstruments((prevState: InstrumentType[]) => [...prevState, newInstrument]);
    setCount(0);
    setIsGrandPianoOnly(false);
  };

  const removeInstrument = (index: number) => {
    const newArray = instruments.slice();
    newArray.splice(index, 1);

    setInstruments(newArray);
  };

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <View style={styles.body}>
        <ScrollView>
          {instruments.length ? instruments.map((instrument, index) => (
            <View key={index} style={styles.instrumentRow}>
              <Text style={{width: '40%'}}>
                {instrument.type === 'UpRightPiano' ? 'Рояль або піаніно' : 'Рояль'}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center', width: '20%'}}>
                <IconButton icon='star' color='orange'/>
                <Text style={{paddingLeft: 6}}>{instrument.rate}+</Text>
              </View>
              <IconButton icon='trash-can-outline' onPress={() => removeInstrument(index)}/>
            </View>
          )) : <Text style={styles.noInstrumentsLabel}>Інструменти не вибрані</Text>}
          <View style={styles.newInstrumentRow}>
            <View style={{width: '40%', flexDirection: 'row', alignItems: 'center'}}>
              <Text onPress={showModalList}>
                {!isGrandPianoOnly ? 'Рояль або піаніно' : 'Рояль'}
              </Text>
              <IconButton icon='menu-down' onPress={showModalList}/>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', width: '20%'}}>
              <IconButton icon='star' color='orange' style={{marginRight: -5}}/>
              <TextInput placeholder='0' style={styles.countInput} autoCompleteType='cc-number'
                         value={count as unknown as string}
                         onChangeText={(text) => setCount(text.replace(/[^0-9]/g, '') as unknown as number)}
                         mode='outlined'
              />
            </View>
            <IconButton icon='plus' onPress={addInstrument}/>
          </View>
        </ScrollView>
        <View style={styles.buttons}>
          <Button mode='contained' onPress={hideModal}>Закрити</Button>
        </View>
      </View>
      <InstrumentsList hideModal={hideModalList} visible={visibleList}
                       isGrandPianoOnly={isGrandPianoOnly} setIsGrandPianoOnly={setIsGrandPianoOnly} />
    </Modal>
  </Portal>
};

const styles = StyleSheet.create(({
  containerStyle: {
    position: 'absolute',
    height: 300,
    width: '90%',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  instrumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  newInstrumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  countInput: {
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
    paddingLeft: 5
  },
  noInstrumentsLabel: {
    textAlign: 'center',
    paddingBottom: 15,
    color: '#ccc',
    fontSize: 18,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  }
}));