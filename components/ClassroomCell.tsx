import React, {useState} from 'react';
import {View, StyleSheet, Text, Dimensions, Image, TouchableHighlight} from "react-native";
import {ClassroomType, DisabledInfo, OccupiedInfo} from "../models/models";
import {fullName, isOccupiedOnSchedule, typeStyle} from "../helpers/helpers";
import {IconButton, Surface} from "react-native-paper";
import InstrumentItem from "./InstrumentItem";
import { useNavigation } from '@react-navigation/native';
import ErrorDialog from "./ErrorDialog";
import moment from "moment";

interface PropTypes {
  classroom: ClassroomType;
  isQueueSetup: boolean;
  addToFilteredList: (classroomId: number) => void;
  filteredList: number[];
}

const windowWidth = Dimensions.get('window').width;

export default function ClassroomsCell({classroom, isQueueSetup, addToFilteredList, filteredList
}: PropTypes) {
  const {name, occupied, schedule, special, instruments, disabled, id} = classroom;
  const navigation = useNavigation();
  const occupiedOnSchedule = isOccupiedOnSchedule(schedule);
  const userFullName = occupied?.user.nameTemp === null ? fullName(occupied?.user, true) :
    occupied?.user.nameTemp;
  const [visible, setVisible] = useState(false);

  const handleTouch = (disabled: DisabledInfo | null) => {
    !disabled && navigation.navigate('ClassroomInfo', {classroom});
    disabled && setVisible(true);
  }

  return <TouchableHighlight onPress={isQueueSetup ? () => addToFilteredList(id) : () => handleTouch(disabled)}
                             underlayColor={disabled ? '#f91354' : '#2b5dff'}
                             style={{borderRadius: 4}}
                             onLongPress={isQueueSetup ? () => handleTouch(disabled) : null}
  >
    <Surface style={[styles.cell,
      disabled ? styles.disabled : occupied ? styles.occupied : styles.free]}
    >
      {filteredList.includes(id) && isQueueSetup ?
        <IconButton icon='check-bold' style={styles.checkMark} color='#0f0'/>
        : null
      }
      <View style={styles.cellHeader}>
        <Text style={styles.name}>{name}</Text>
        <Image source={require('./../assets/images/specialPiano.png')}
               style={[special ? styles.special : styles.notSpecial]}/>
      </View>
      <Text style={[styles.occupationInfo, typeStyle(occupied as OccupiedInfo)]} numberOfLines={1}>
        {disabled ? disabled.comment : occupied
        ? userFullName
        : occupiedOnSchedule ? 'Зайнято за розкладом': 'Вільно'}</Text>
      <View style={styles.instruments}>
        {instruments?.length
          ? instruments
            .slice()
            .sort((a, b) => b.rate - a.rate).slice(0, 2)
            .map(instrument => <InstrumentItem instrument={instrument}/>)
          : <View style={styles.space}/>}
      </View>
      <ErrorDialog message={'Аудиторія відключена до ' + moment(disabled?.until)
        .format('DD.MM.YYYY HH:MM') +
      '\n' + disabled?.comment} visible={visible}
                   hideDialog={() => setVisible(false)}
      />
    </Surface>
  </TouchableHighlight>
};

const styles = StyleSheet.create({
  cell: {
    width: (windowWidth-10)/3,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    margin: 1,
    elevation: 2,
    borderRadius: 4,
    position: 'relative'
  },
  cellHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: (windowWidth-10)/3,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
  },
  name: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  special: {
    width: 20,
    height: 20,
    opacity: 1
  },
  notSpecial: {
    width: 20,
    height: 20,
    opacity: 0
  },
  occupied: {
  },
  free: {
    backgroundColor: '#4bfd63'
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  occupationInfo: {
    width: (windowWidth-10)/3,
    margin: 2,
    paddingHorizontal: 4,
    paddingBottom: 2,
    textAlign: 'center'
  },
  instruments: {
    flexDirection: 'row'
  },
  space: {
    height: 20,
    margin: 8,
  },
  checkMark: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: '#00000088'
  }
});