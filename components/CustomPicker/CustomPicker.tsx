import React, {useEffect, useState} from 'react';
import {Modal, Portal, Searchbar} from "react-native-paper";
import {ScrollView, Text, StyleSheet} from "react-native";

interface PropTypes {
  visible: boolean;
  hideDialog: () => void;
  setSelected: (value: any) => void;
  selected: any;
  items: any[];
}

export default function CustomPicker({visible, hideDialog, setSelected,selected, items}: PropTypes) {
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState<any>([]);

  useEffect(() => {
    const filtered = items.length && items.filter(({name}) => {
      if (searchText !== '') return String(name).toLowerCase().includes(searchText.toLowerCase());
      return true;
    });
    setFilteredItems(filtered);
  }, [items, searchText]);

  const handlePress = (item: any) => {
    setSelected({name: item.name, id: item.id});
    hideDialog();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideDialog} contentContainerStyle={styles.container}>
        <Searchbar
          placeholder="Пошук"
          onChangeText={text => setSearchText(text)}
          value={searchText}
          style={styles.search}
          clearButtonMode='while-editing'
        />
        <ScrollView style={{height: '80%'}}>
          {filteredItems && [{name: 'Не вибрано', id: -1}, ...filteredItems].map(item => (
                <Text key={item.id} style={selected.id === item.id ? styles.selected : styles.item}
                      onPress={() => handlePress(item)}
                >
                  {item.name}
                </Text>
              )
            )}
        </ScrollView>
      </Modal>
    </Portal>
  )
};

const styles = StyleSheet.create({
  item: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#ccc',
    padding: 10,
    color: '#000',
  },
  selected: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#2b5dff',
    padding: 10,
    color: '#2b5dff'
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 8,
    justifyContent: 'center',
    height: '60%'
  },
  search: {
    marginBottom: 10
  }
});