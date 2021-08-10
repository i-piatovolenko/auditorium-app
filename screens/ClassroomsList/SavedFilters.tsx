import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, TextInput} from "react-native";
import {Button, Checkbox, Headline, IconButton, Modal, Portal} from "react-native-paper";
import {ClassroomType, SavedFilterT} from "../../models/models";
import {getItem, setItem} from "../../api/asyncStorage";
import {useLocal} from "../../hooks/useLocal";
import Colors from "../../constants/Colors";
import {filterSavedFilter} from "../../helpers/filterSavedFIlters";
import useClassrooms from "../../hooks/useClassrooms";

export type SpecialT = 'with' | 'only' | 'without';

interface PropTypes {
  hideModal: () => void;
  visible: boolean;
}

const windowWidth = Dimensions.get('window').width;

export default function SavedFilters({hideModal, visible}: PropTypes) {
  const classrooms: ClassroomType[] = useClassrooms();
  const [savedFilters, setSavedFilters] = useState<SavedFilterT[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [inputName, setInputName] = useState<string>('');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const [selectedFilter, setSelectedFilter] = useState(-1);
  const [saveAsMainFilter, setSaveAsMainFilter] = useState(false);

  useEffect(() => {
    getItem('filters').then(data => {
      setSavedFilters(data as any);
    });
    return () => {
      setSelectedFilter(-1);
      setInputName('');
    };
  }, []);

  const handleSaveFilter = () => {
    setIsSaving(true);

    const item: SavedFilterT = {
      minimalClassroomIds,
      desirableClassroomIds,
      name: inputName,
      main: saveAsMainFilter
    };

    setItem('filters', [...savedFilters?.map((filter: any) => {
      return saveAsMainFilter ? ({...filter, main: false}) : filter
    }), item]).then(res => {
      setIsSaving(false);
    });
    // @ts-ignore
    setSavedFilters(prevState => [...prevState?.map((filter: any) => {
      return saveAsMainFilter ? ({...filter, main: false}) : filter
    }), item]);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = savedFilters;

    newFilters.splice(index, 1);
    setItem('filters', newFilters).then(res => {
      getItem('filters').then((data: any) => setSavedFilters(data))
    })
    setSelectedFilter(-1);
  };

  const handleSelectFilter = (filterItem: any, index: number) => {
    filterSavedFilter(filterItem, classrooms)
    setSelectedFilter(index);
    hideModal();
  };

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <View style={styles.header}>
        <Headline>Збережені фільтри</Headline>
      </View>
      <View style={styles.body}>
        {savedFilters?.map((filterItem: SavedFilterT, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={selectedFilter === index ? styles.selectedItem : styles.item}
                  onPress={() => handleSelectFilter(filterItem, index)}>
              {filterItem.main ? filterItem.name + ' (основний)' : filterItem.name}
            </Text>
            <IconButton icon='trash-can-outline' style={styles.bin}
              onPress={() => handleRemoveFilter(index)}
            />
          </View>
        ))}
        <View style={styles.newFilterSection}>
          <TextInput placeholder='Назва нового фільтру' value={inputName}
                     onChangeText={text => setInputName(text)}
          />
          <View style={styles.mainFilterCheckbox}>
            <Checkbox status={saveAsMainFilter ? 'checked' : 'unchecked'}
                    onPress={() => setSaveAsMainFilter(prevState => !prevState)}
            />
            <Text>Застосувати як основний фільтр</Text>
          </View>
          <Button mode='contained'
                  disabled={isSaving || !inputName}
                  onPress={handleSaveFilter}
          >
            Зберегти новий сет аудиторій
          </Button>
        </View>
      </View>
    </Modal>
  </Portal>
};

const styles = StyleSheet.create({
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
    width: '100%',
  },
  itemRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  item: {
    paddingBottom: 10,
    fontSize: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginBottom: 10,
    color: '#000',
    width: '80%',
  },
  selectedItem: {
    paddingBottom: 10,
    fontSize: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginBottom: 10,
    color: Colors.blue,
    width: '80%',
  },
  bin: {
    width: '20%',
  },
  mainFilterCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: -10
  },
  newFilterSection: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    marginTop: 50
  }
});