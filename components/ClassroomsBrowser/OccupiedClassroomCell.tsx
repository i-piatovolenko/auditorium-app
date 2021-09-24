import React from "react";
import {Dimensions, Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {ClassroomType, DisabledState, Mode} from "../../models/models";
import Colors from "../../constants/Colors";
import {IconButton, Surface} from "react-native-paper";
import InstrumentItem from "../InstrumentItem";
import {fullName, typeStyle} from "../../helpers/helpers";
import {useNavigation} from "@react-navigation/native";
import {useLocal} from "../../hooks/useLocal";
import {desirableClassroomIdsVar, minimalClassroomIdsVar} from "../../api/client";

const windowWidth = Dimensions.get('window').width;
const cellWidth = ((windowWidth - 10) / 3);

type PropTypes = {
  classroom: ClassroomType;
  isEnabledForCurrentUser: boolean;
}

const OccupiedClassroomCell: React.FC<PropTypes> = ({classroom, isEnabledForCurrentUser}) => {
  const navigation = useNavigation();
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');

  const special = !!classroom.special;
  const {instruments, occupied, disabled, isHidden} = classroom;
  const isDisabled = disabled.state === DisabledState.DISABLED || !isEnabledForCurrentUser;
  const userFullName = fullName(occupied.user, true);

  const handleCheck = () => {
    if (isMinimalSetup) {
      const minimalSet = new Set([...minimalClassroomIds]);
      minimalSet.has(classroom.id) ? minimalSet.delete(classroom.id) : minimalSet.add(classroom.id)
      minimalClassroomIdsVar([...minimalSet]);
    } else {
      const desiredSet = new Set([...desirableClassroomIds]);
      desiredSet.has(classroom.id) ? desiredSet.delete(classroom.id) : desiredSet.add(classroom.id)
      desirableClassroomIdsVar([...desiredSet]);
    }
  };

  const handlePress = () => {
    if (mode === Mode.QUEUE_SETUP ||
      (mode === Mode.QUEUE_SETUP && disabled.state === DisabledState.DISABLED)) {
      handleCheck();
    } else {
      navigation.navigate('ClassroomInfo', {classroomId: classroom.id});
    }
  };

  const handleLongPress = () => {
    navigation.navigate('ClassroomInfo', {classroomId: classroom.id});
  };

  const isChecked = () => {
    if (isMinimalSetup) {
      return minimalClassroomIds.includes(classroom.id) && mode === Mode.QUEUE_SETUP;
    } else {
      return desirableClassroomIds.includes(classroom.id) && mode === Mode.QUEUE_SETUP;
    }
  };

  const cellStyle = StyleSheet.create({
    cell: {
      width: cellWidth,
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
      margin: 1,
      elevation: 2,
      borderRadius: 4,
      position: 'relative',
      overflow: 'hidden',
      opacity: isHidden ? .5 : 1,
      backgroundColor: isDisabled ? '#ccc' : '#fff'
    }
  });

  return (
    <TouchableHighlight onPress={handlePress} onLongPress={handleLongPress}>
      <Surface style={cellStyle.cell}>
        {isChecked() && (
          <IconButton icon='check-bold' style={styles.checkMark} color='#0f0'
                      onPress={handlePress} onLongPress={handleLongPress}/>
        )}
        <View style={styles.cellHeader}>
          <Text style={styles.name}>{classroom.name}</Text>
          <Image source={require('./../../assets/images/specialPiano.png')}
                 style={[special ? styles.special : styles.notSpecial]}/>
        </View>
        <Text style={[styles.occupationInfo, typeStyle(occupied, isDisabled)]} numberOfLines={1}>
          {isDisabled ? !isEnabledForCurrentUser ? 'Для студентів кафедри' : disabled?.comment : userFullName}
        </Text>
        <View style={styles.instruments}>
          {instruments?.length
            ? instruments
              .slice()
              .sort((a, b) => b.rate - a.rate).slice(0, 2)
              .map(instrument => <InstrumentItem instrument={instrument} key={instrument.id}/>)
            : <View style={styles.space}/>}
        </View>
      </Surface>
    </TouchableHighlight>
  )
}

export default OccupiedClassroomCell;

const styles = StyleSheet.create({
  occupationInfo: {
    width: cellWidth,
    margin: 2,
    paddingHorizontal: 4,
    paddingBottom: 2,
    textAlign: 'center'
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
    height: 30,
    resizeMode: "stretch",
    tintColor: Colors.red
  }
});