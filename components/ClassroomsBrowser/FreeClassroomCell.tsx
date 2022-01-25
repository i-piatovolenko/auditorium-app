import React, {useCallback} from "react";
import {Image, Platform, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {ClassroomType, DisabledState, Mode, Platforms} from "../../models/models";
import Colors from "../../constants/Colors";
import {IconButton, Surface} from "react-native-paper";
import InstrumentItem from "../InstrumentItem";
import {useNavigation} from "@react-navigation/native";
import TextTicker from "react-native-text-ticker";
import moment from "moment";
import {useLocal} from "../../hooks/useLocal";
import {getMinutesFromHHMM} from "../../helpers/helpers";
import Layout from "../../constants/Layout";
import {desirableClassroomIdsVar, minimalClassroomIdsVar} from "../../api/localClient";

type PropTypes = {
  classroom: ClassroomType;
  isEnabledForCurrentUser: boolean;
}

const FreeClassroomCell: React.FC<PropTypes> = ({classroom, isEnabledForCurrentUser}) => {
  const navigation = useNavigation();
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const special = !!classroom.special;
  const {instruments, disabled} = classroom;
  const isDisabled = disabled.state === DisabledState.DISABLED || !isEnabledForCurrentUser;

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

  const isChecked = () => {
    if (isMinimalSetup) {
      return minimalClassroomIds.includes(classroom.id) && mode === Mode.QUEUE_SETUP;
    } else {
      return desirableClassroomIds.includes(classroom.id) && mode === Mode.QUEUE_SETUP;
    }
  };

  const handlePress = () => {
    if (mode === Mode.QUEUE_SETUP && disabled.state === DisabledState.DISABLED) {
      handleCheck();
    } else {
      navigation.navigate('ClassroomInfo', {classroomId: classroom.id});
    }
  };

  const handleLongPress = () => {
    navigation.navigate('ClassroomInfo', {classroomId: classroom.id});
  };

  const defineStatus = useCallback(() => {
    const schedule = classroom.schedule.filter(unit => {
      const currentHHMM = getMinutesFromHHMM(moment().format('HH:MM'));
      const unitFromHHMM = getMinutesFromHHMM(unit.from);
      return unitFromHHMM >= currentHHMM;
    }).slice().sort((a, b) => {
      return getMinutesFromHHMM(a.from) - getMinutesFromHHMM(b.from);
    });
    return isDisabled ? !isEnabledForCurrentUser ?
      !classroom.queueInfo.queuePolicy
        .queueAllowedDepartments.length ? Platform.OS === Platforms.WEB ? 'Недоступно'
        : 'Недоступно для студентів' : Platform.OS === Platforms.WEB ? 'Недоступно' :
        'Тільки ' + classroom.queueInfo.queuePolicy
          .queueAllowedDepartments.map(({department: {name}}) => name.toLowerCase()).join(', ')
      : Platform.OS === Platforms.WEB ? disabled?.comment
        : disabled?.comment + ' до ' + moment(disabled.until).format('DD-MM-YYYY HH:mm')
      : schedule.length ? `Зайнято з ${schedule[0].from}` : 'Вільно';
  }, [isDisabled, isEnabledForCurrentUser, classroom.queueInfo.queuePolicy])

  return (
    <TouchableHighlight onPress={handlePress} onLongPress={handleLongPress}>
      <Surface style={[styles.cell, isDisabled ? styles.disabled : styles.free]}>
        {isChecked() && (
          <IconButton icon='check-bold' style={styles.checkMark} color='#0f0'
                      onPress={handlePress} onLongPress={handleLongPress}/>
        )}
        <View style={styles.cellHeader}>
          <Text style={classroom.name.length > 2 ? styles.longName : styles.name}>{classroom.name}</Text>
          <Image source={require('./../../assets/images/specialPiano.png')}
                 style={[special ? styles.special : styles.notSpecial]}/>
        </View>
        <View style={styles.statusWrapper}>
          <TextTicker
            style={styles.occupationInfo}
            animationType='auto'
            duration={defineStatus().length * 500}
            loop
            repeatSpacer={10}
            marqueeDelay={0}
          >
            {defineStatus()}
          </TextTicker>
        </View>
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

export default FreeClassroomCell;

const styles = StyleSheet.create({
  cell: {
    width: Layout.cellWidth,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    margin: 1,
    elevation: 2,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  statusWrapper: {
    width: Layout.cellWidth,
    backgroundColor: '#00000011',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  occupationInfo: {
    margin: 2,
    paddingHorizontal: 4,
    paddingBottom: 2,
    textAlign: 'center',
    overflow: Platform.OS === Platforms.WEB ? 'hidden' : 'visible',
  },
  free: {
    backgroundColor: '#4bfd63'
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  cellHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Layout.cellWidth,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
  },
  name: {
    fontSize: 35,
    lineHeight: 35,
    fontWeight: 'bold',
  },
  longName: {
    fontSize: 26,
    lineHeight: 35,
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
    width: Layout.cellWidth,
  },
  timeLeft: {
    fontSize: 12,
    backgroundColor: '#f91354',
    color: '#fff',
    width: Layout.cellWidth,
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
