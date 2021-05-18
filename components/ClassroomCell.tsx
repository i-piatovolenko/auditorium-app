import React, {useState} from 'react';
import {View, StyleSheet, Text, Dimensions, Image} from "react-native";
import {ClassroomType, OccupiedInfo} from "../models/models";
import {fullName, isOccupiedOnSchedule, typeStyle} from "../helpers/helpers";
import {Surface} from "react-native-paper";
import InstrumentItem from "./InstrumentItem";
import { useNavigation } from '@react-navigation/native';

interface PropTypes {
  classroom: ClassroomType;
}

const windowWidth = Dimensions.get('window').width;

export default function ClassroomsCell({classroom}: PropTypes) {
  const {name, occupied, schedule, special, instruments} = classroom;
  const navigation = useNavigation();
  const occupiedOnSchedule = isOccupiedOnSchedule(schedule);
  const userFullName = occupied?.user.nameTemp === null ? fullName(occupied?.user, true) :
    occupied?.user.nameTemp;
  const [isTouched, setIsTouched] = useState(false);
  const handleTouch = () => {
    setIsTouched(false);
    navigation.navigate('ClassroomInfo', {classroom});
  }

  return <Surface style={[styles.cell, occupied ? styles.occupied : styles.free]}
                  onTouchStart={() => setIsTouched(true)}
                  onTouchEnd={handleTouch}
  >
    <View style={styles.cellHeader}>
      <Text style={styles.name}>{name}</Text>
      <Image source={require('./../assets/images/specialPiano.png')}
             style={[special ? styles.special : styles.notSpecial]}/>
    </View>
    <Text style={[styles.occupationInfo, typeStyle(occupied as OccupiedInfo)]} numberOfLines={1}>{occupied
      ? userFullName
      : occupiedOnSchedule ? 'Зайнято за розкладом': ''}</Text>
    <View style={styles.instruments}>
      {instruments?.length ? instruments.slice().sort((a, b) => b.rate - a.rate).slice(0, 2)
        .map(instrument => <InstrumentItem instrument={instrument}/>)
        : <View style={styles.space}/>}
    </View>
  </Surface>
};

const styles = StyleSheet.create({
  cell: {
    width: (windowWidth-6)/3,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    margin: 1,
    elevation: 2,
    borderRadius: 4,
  },
  cellHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: (windowWidth-6)/3,
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
  occupationInfo: {
    width: (windowWidth-6)/3,
    margin: 2,
    textAlign: 'center'
  },
  instruments: {
    flexDirection: 'row'
  },
  space: {
    height: 20,
    margin: 8,
  }
});