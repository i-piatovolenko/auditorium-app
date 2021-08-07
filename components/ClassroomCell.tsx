import React, {useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {ClassroomType, DisabledInfo, Mode, OccupiedInfo, OccupiedState} from "../models/models";
import {fullName, isOccupiedOnSchedule, isPendingForMe, typeStyle} from "../helpers/helpers";
import {IconButton, Surface} from "react-native-paper";
import InstrumentItem from "./InstrumentItem";
import {useNavigation} from '@react-navigation/native';
import ErrorDialog from "./ErrorDialog";
import moment from "moment";
import {useLocal} from "../hooks/useLocal";
import addToFilteredList from "../helpers/queue/addToFilteredList";
import {useQuery} from "@apollo/client";
import {GET_ME} from "../api/operations/queries/me";
import useTimeLeft from "../hooks/useTimeLeft";
import Colors from "../constants/Colors";

interface PropTypes {
  classroom: ClassroomType;
  filteredList: number[];
}

const windowWidth = Dimensions.get('window').width;
const cellWidth = ((windowWidth - 10) / 3);

export default function ClassroomsCell({
                                         classroom, filteredList
                                       }: PropTypes) {
  const {name, occupied, schedule, special, instruments, disabled, id} = classroom;
  const navigation = useNavigation();
  const occupiedOnSchedule = isOccupiedOnSchedule(schedule);
  const userFullName = occupied?.user.nameTemp === null ? fullName(occupied?.user, true) :
    occupied?.user.nameTemp;
  const [visible, setVisible] = useState(false);
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const {data: {me}} = useQuery(GET_ME);
  const occupiedTotalTime = occupied?.state === OccupiedState.OCCUPIED ? 180 : 2;
  const [timeLeft, timeLeftInPer] = useTimeLeft(occupied as OccupiedInfo, occupiedTotalTime);

  const handleTouch = (disabled: DisabledInfo | null) => {
    !disabled && navigation.navigate('ClassroomInfo', {classroom});
    disabled && setVisible(true);
  };

  const ProgressBackground = () => (
    <View
      style={{...styles.timeLeftProgress,
        width: (cellWidth / 100) * (timeLeftInPer as number)}}
    />
  );

  return <TouchableHighlight
    onPress={mode === Mode.QUEUE_SETUP && occupied
      ? () => addToFilteredList(id, isMinimalSetup, minimalClassroomIds, desirableClassroomIds)
      : () => handleTouch(disabled)
    }
    underlayColor={disabled ? '#f91354' : '#2b5dff'}
    style={{borderRadius: 4}}
    onLongPress={mode === Mode.QUEUE_SETUP ? () => handleTouch(disabled) : null}
  >
    <Surface style={[styles.cell,
      disabled ? styles.disabled : occupied ? styles.occupied : styles.free]}
    >
      {filteredList.includes(id) && mode === Mode.QUEUE_SETUP && (
        <IconButton icon='check-bold' style={styles.checkMark} color='#0f0'/>
      )}
      {isPendingForMe(occupied as OccupiedInfo, me, mode) && (
        <>
          {occupied?.state === OccupiedState.RESERVED && (
            <Image source={require('../assets/images/key.png')} style={styles.keyImage} />
          )}
          <ProgressBackground/>
        </>
      )}
      {occupied && occupied.user.id === me.id && occupied.state === OccupiedState.OCCUPIED && (
        <ProgressBackground/>
      )}
      <View style={styles.cellHeader}>
        <Text style={styles.name}>{name}</Text>
        <Image source={require('./../assets/images/specialPiano.png')}
               style={[special ? styles.special : styles.notSpecial]}/>
      </View>
      {isPendingForMe(occupied as OccupiedInfo, me, mode) ||
      occupied && occupied.user.id === me.id && occupied.state === OccupiedState.OCCUPIED ? (
        <Text style={styles.timeLeft}>{timeLeft}</Text>
      ) : (
        <Text style={[styles.occupationInfo, typeStyle(occupied as OccupiedInfo)]} numberOfLines={1}>
          {disabled ? disabled.comment : occupied
            ? userFullName
            : occupiedOnSchedule ? 'Зайнято за розкладом' : 'Вільно'}
        </Text>
      )}
      <View style={styles.instruments}>
        {instruments?.length
          ? instruments
            .slice()
            .sort((a, b) => b.rate - a.rate).slice(0, 2)
            .map(instrument => <InstrumentItem instrument={instrument} key={instrument.id}/>)
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
    width: cellWidth,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    margin: 1,
    elevation: 2,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden'
  },
  cellHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: cellWidth,
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
  occupied: {},
  free: {
    backgroundColor: '#4bfd63'
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  occupationInfo: {
    width: cellWidth,
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
  },
  timeLeftProgress: {
    left: 0,
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: '#00000033',
    height: 100,
    width: cellWidth,
  },
  timeLeft: {
    fontSize: 12,
    backgroundColor: '#f91354',
    color: '#fff',
    width: cellWidth,
    margin: 2,
    paddingHorizontal: 4,
    paddingBottom: 2,
    textAlign: 'center'
  },
  keyImage: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height:30,
    resizeMode: "stretch",
    tintColor: Colors.red
  }
});