import React, {useCallback} from "react";
import {Dimensions, Image, StyleSheet, Text, TouchableHighlight, View, Platform} from "react-native";
import {ClassroomType, DisabledState, Platforms} from "../../models/models";
import Colors from "../../constants/Colors";
import {Surface} from "react-native-paper";
import InstrumentItem from "../InstrumentItem";
import {useNavigation} from "@react-navigation/native";
import TextTicker from "react-native-text-ticker";
import moment from "moment";

const WINDOW_WIDTH = Dimensions.get('window').width;
const CELL_WIDTH = ((WINDOW_WIDTH - 10) / 3);
const TICKER_SCROLL_DURATION = 6000;

type PropTypes = {
  classroom: ClassroomType;
  isEnabledForCurrentUser: boolean;
}

const FreeClassroomCell: React.FC<PropTypes> = ({classroom, isEnabledForCurrentUser}) => {
  const navigation = useNavigation();
  const special = !!classroom.special;
  const {instruments, disabled} = classroom;
  const isDisabled = disabled.state === DisabledState.DISABLED || !isEnabledForCurrentUser;

  const handlePress = () => {
    navigation.navigate('ClassroomInfo', {classroomId: classroom.id});
  };

  const defineStatus = useCallback(() => {
    return isDisabled ? !isEnabledForCurrentUser ?
      !classroom.queueInfo.queuePolicy
        .queueAllowedDepartments.length ? Platform.OS === Platforms.WEB ? 'Недоступно'
        : 'Недоступно для студентів' : Platform.OS === Platforms.WEB ? 'Недоступно' :
        'Тільки ' + classroom.queueInfo.queuePolicy
          .queueAllowedDepartments.map(({department: {name}}) => name.toLowerCase()).join(', ')
      : Platform.OS === Platforms.WEB ? disabled?.comment
        : disabled?.comment + ' до ' + moment(disabled.until).format('DD-MM-YYYY HH:mm')
      : 'Вільно'
  }, [isDisabled, isEnabledForCurrentUser, classroom.queueInfo.queuePolicy])

  return (
    <TouchableHighlight onPress={handlePress}>
      <Surface style={[styles.cell, isDisabled ? styles.disabled : styles.free]}>
        <View style={styles.cellHeader}>
          <Text style={styles.name}>{classroom.name}</Text>
          <Image source={require('./../../assets/images/specialPiano.png')}
                 style={[special ? styles.special : styles.notSpecial]}/>
        </View>
        <View style={styles.statusWrapper}>
          <TextTicker
            style={styles.occupationInfo}
            animationType='scroll'
            duration={TICKER_SCROLL_DURATION}
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
    width: CELL_WIDTH,
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
    width: CELL_WIDTH,
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
    width: CELL_WIDTH,
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
    width: CELL_WIDTH,
  },
  timeLeft: {
    fontSize: 12,
    backgroundColor: '#f91354',
    color: '#fff',
    width: CELL_WIDTH,
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