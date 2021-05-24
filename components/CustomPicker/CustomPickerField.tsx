import React, {useState} from 'react';
import {Text, StyleSheet} from "react-native";
import {IconButton} from "react-native-paper";
import {View} from "../Themed";
import CustomPicker from "./CustomPicker";

type Item = {
  name: string;
  id: number;
}

interface PropTypes {
  selected: Item;
  setSelected: (value: Item) => void;
  name: string;
  items: any[];
}

export default function CustomPickerField({selected, name, setSelected, items}: PropTypes) {
  const [visiblePicker, setVisiblePicker] = useState(false);

  const showPicker = () => setVisiblePicker(true);

  const hidePicker = () => setVisiblePicker(false);

  return <View style={styles.picker}>
    <Text style={styles.pickerField} numberOfLines={1} onPress={showPicker}>
      {selected.id === -1 ? name : selected.name}
    </Text>
    <IconButton icon='chevron-down' style={styles.pickerIcon} color='#ccc'
                onPress={showPicker}
    />
    <CustomPicker visible={visiblePicker} hideDialog={hidePicker}
                  setSelected={setSelected} items={items}
                  selected={selected}
    />
  </View>
};

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    position: 'relative',
  },
  pickerField: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingLeft: 22,
    paddingRight: 42,
    fontSize: 22,
    marginTop: 20,
    color: '#6f6f6f',
    width: '100%'
  },
  pickerIcon: {
    position: 'absolute',
    right: 0,
    top: 20,
  }
});