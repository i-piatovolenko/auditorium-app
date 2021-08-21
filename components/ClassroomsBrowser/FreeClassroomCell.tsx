import React from "react";
import {Dimensions, Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {ClassroomType, DisabledState} from "../../models/models";
import Colors from "../../constants/Colors";
import {Surface} from "react-native-paper";
import InstrumentItem from "../InstrumentItem";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get('window').width;
const cellWidth = ((windowWidth - 10) / 3);

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

  return (
    <TouchableHighlight onPress={handlePress}>
      <Surface style={[styles.cell, isDisabled ? styles.disabled : styles.free]}>
        <View style={styles.cellHeader}>
          <Text style={styles.name}>{classroom.name}</Text>
          <Image source={require('./../../assets/images/specialPiano.png')}
                 style={[special ? styles.special : styles.notSpecial]}/>
        </View>
        <Text style={styles.occupationInfo} numberOfLines={1}>
          {isDisabled ? !isEnabledForCurrentUser ? 'Для студентів кафедри' : disabled?.comment : 'Вільно'}
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

export default FreeClassroomCell;

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
    overflow: 'hidden',
  },
  occupationInfo: {
    width: cellWidth,
    margin: 2,
    paddingHorizontal: 4,
    paddingBottom: 2,
    textAlign: 'center',
    backgroundColor: '#00000011'
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