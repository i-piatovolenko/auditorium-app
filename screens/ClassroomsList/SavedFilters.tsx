import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Dimensions, TextInput, Platform} from "react-native";
import {Button, Checkbox, Headline, IconButton, Modal, Portal} from "react-native-paper";
import {ClassroomType, Platforms, SavedFilterT, User} from "../../models/models";
import {getItem, setItem} from "../../api/asyncStorage";
import {useLocal} from "../../hooks/useLocal";
import Colors from "../../constants/Colors";
import {filterSavedFilter} from "../../helpers/filterSavedFIlters";
import useClassrooms from "../../hooks/useClassrooms";
import CheckBox from "react-native-check-box";
import WithKeyboardDismissWrapper from "../../components/WithKeyboardDismissWrapper";

export type SpecialT = 'with' | 'only' | 'without';

interface PropTypes {
  hideModal: () => void;
  visible: boolean;
  currentUser: User;
}

export default function SavedFilters({hideModal, visible, currentUser}: PropTypes) {
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

    setItem('filters', savedFilters ? [...savedFilters?.map((filter: any) => {
      return saveAsMainFilter ? ({...filter, main: false}) : filter
    }), item] : [item]).then(res => {
      setIsSaving(false);
    });
    // @ts-ignore
    setSavedFilters(prevState => prevState ? [...prevState?.map((filter: any) => {
      return saveAsMainFilter ? ({...filter, main: false}) : filter
    }), item] : [item]);
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
    filterSavedFilter(filterItem, classrooms, currentUser)
    setSelectedFilter(index);
    hideModal();
  };

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <View style={styles.header}>
        <Headline>Збережені фільтри</Headline>
      </View>
      <WithKeyboardDismissWrapper>
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
          <TextInput placeholder='Назва нового фільтру'
                     value={inputName}
                     onChangeText={text => setInputName(text)}
                     style={styles.newFilterNameInput}
          />
          <View style={[styles.mainFilterCheckbox, { opacity: saveAsMainFilter ? 1 : .3 }]}>
            {Platform.OS === Platforms.WEB ? (
              <Checkbox status={saveAsMainFilter ? 'checked' : 'unchecked'}
                        onPress={() => setSaveAsMainFilter(prevState => !prevState)}
              />
            ) : (
              <CheckBox
                isChecked={saveAsMainFilter}
                onClick={() => setSaveAsMainFilter(prevState => !prevState)}
              />
            )}
            <Text
              onPress={() => setSaveAsMainFilter(prevState => !prevState)}
              style={styles.checkboxLabel}
            >
              Застосувати як основний
            </Text>
          </View>
          <Button mode='contained'
                  disabled={isSaving || !inputName}
                  onPress={handleSaveFilter}
          >
            + новий фільтр
          </Button>
        </View>
      </View>
      </WithKeyboardDismissWrapper>
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
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  item: {
    fontSize: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    color: '#000',
    width: '80%',
    marginTop: 10
  },
  selectedItem: {
    fontSize: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    color: Colors.blue,
    width: '80%',
    marginTop: 10
  },
  bin: {
    width: '20%',
  },
  mainFilterCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
  },
  checkboxLabel: {
    paddingLeft: 8,
  },
  newFilterSection: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    marginTop: 50
  },
  newFilterNameInput: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingBottom: 10,
  }
});
