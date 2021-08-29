import React, {useEffect, useState} from 'react';
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
  setSelected: any;
  name: string;
  items: any[];
  checkValidation: (value: number) => void;
  setIsVisited: (value: boolean) => void;
  underlineColor: string;
}

export default function CustomPickerField({
                                            selected, name, setSelected, items, setIsVisited,
                                            checkValidation, underlineColor
                                          }: PropTypes) {
  const [visiblePicker, setVisiblePicker] = useState(false);

  useEffect(() => {
    checkValidation(selected.id);
  }, [selected]);

  const showPicker = () => {
    setVisiblePicker(true);
    setIsVisited(true);
  };

  const hidePicker = () => {
    checkValidation(selected.id);
    setVisiblePicker(false);
  };

  return <View style={styles.picker}>
    <Text style={[styles.pickerField, {borderBottomColor: underlineColor}]} numberOfLines={1}
          onPress={showPicker}
    >
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
    backgroundColor: '#fff',
  },
  pickerField: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 10,
    paddingLeft: 22,
    paddingRight: 42,
    fontSize: 22,
    marginTop: 20,
    color: '#6f6f6f',
    width: '100%',
  },
  pickerIcon: {
    position: 'absolute',
    right: 0,
    top: 20,
  }
});