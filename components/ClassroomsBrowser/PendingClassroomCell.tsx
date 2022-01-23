import React from "react";
import {Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {ClassroomType, DisabledState} from "../../models/models";
import Colors from "../../constants/Colors";
import {Surface} from "react-native-paper";
import InstrumentItem from "../InstrumentItem";
import useTimeLeft from "../../hooks/useTimeLeft";
import {useNavigation} from "@react-navigation/native";
import Layout from "../../constants/Layout";

type PropTypes = {
  classroom: ClassroomType;
}

const PendingClassroomCell: React.FC<PropTypes> = ({classroom}) => {
  const navigation = useNavigation();
  const special = !!classroom.special;
  const {instruments, occupied, disabled} = classroom;
  const isDisabled = disabled.state === DisabledState.DISABLED;
  const [timeLeft, timeLeftInPer] = useTimeLeft(occupied, 2);

  const handlePress = () => {
    navigation.navigate('ClassroomInfo', {classroomId: classroom.id});
  };

  const ProgressBackground = () => (
    <View
      style={{
        ...styles.timeLeftProgress,
        width: (Layout.cellWidth / 100) * (timeLeftInPer as number)
      }}
    />
  );

  return (
    <TouchableHighlight onPress={handlePress}>
      <Surface style={[styles.cell, isDisabled ? styles.disabled : styles.occupied]}>
        <ProgressBackground/>
        <View style={styles.cellHeader}>
          <Text style={styles.name}>{classroom.name}</Text>
          <Image source={require('./../../assets/images/specialPiano.png')}
                 style={[special ? styles.special : styles.notSpecial]}/>
        </View>
        <Text style={styles.timeLeft} numberOfLines={1}>
          {timeLeft}
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

export default PendingClassroomCell;

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
  occupied: {},
  disabled: {
    backgroundColor: '#ccc',
  },
  occupationInfo: {
    width: Layout.cellWidth,
    margin: 2,
    paddingHorizontal: 4,
    paddingBottom: 2,
    textAlign: 'center'
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
