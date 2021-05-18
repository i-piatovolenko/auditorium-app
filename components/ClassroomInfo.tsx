import React, {useState} from 'react';
import {View, Text, StyleSheet} from "react-native";
import {
  InstrumentType,
  ScheduleUnitType,
  UserTypeColors,
  UserTypes,
  UserTypesUa
} from "../models/models";
import {ActivityIndicator, Appbar, Chip, Divider, Headline, Surface} from "react-native-paper";
import InstrumentItem from "./InstrumentItem";
import {useNavigation} from "@react-navigation/native";
import ScheduleItem from "./ScheduleItem";
import {useQuery} from "@apollo/client";
import {GET_SCHEDULE_UNIT} from "../api/operations/queries/schedule";
import {fullName, getTimeHHMM, isOccupiedOnSchedule, ISODateString} from "../helpers/helpers";
import UserInfo from "./UserInfo";

interface PropTypes {
  route: any;
}

export default function ClassroomInfo({route: {params: {classroom}}}: PropTypes) {
  const {
    name, isWing, isOperaStudio, chair, description, special, floor, instruments,
    schedule, occupied
  } = classroom;
  const navigation = useNavigation();
  const {data, loading, error} = useQuery(GET_SCHEDULE_UNIT, {
    variables: {
      classroomName: name,
      date: ISODateString(new Date()),
    },
  });
  const userFullName = occupied?.user.nameTemp === null ? fullName(occupied?.user) :
    occupied?.user.nameTemp;
  const occupiedOnSchedule = isOccupiedOnSchedule(schedule);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  return <View>
      <Appbar style={styles.top}>
        <Appbar.BackAction onPress={() => navigation.goBack()}/>
        <Appbar.Content title={`Аудиторія ${name}`}/>
      </Appbar>
      <View style={styles.wrapper}>
        {chair && <>
            <Headline style={styles.department}>{chair.name}</Headline>
            <Divider style={styles.divider}/>
        </>}
        {(isWing || isOperaStudio || special) && <>
            <View style={styles.tags}>
              {isWing && <Chip selected selectedColor='#00f' mode='outlined'
                               style={styles.tag}>Флігель</Chip>}
              {isOperaStudio && <Chip selected selectedColor='#00f' mode='outlined'
                                      style={styles.tag}>Оперна студія</Chip>}
              {special && <Chip selected selectedColor='#00f' mode='outlined'
                                style={styles.tag}>Спеціалізована</Chip>}
            </View>
            <Divider style={styles.divider}/>
        </>}
        <Text style={styles.description}>
          {description}
        </Text>
        <Divider style={styles.divider}/>
        <Text style={styles.description}>
          Поверх: {floor}
        </Text>
        <Divider style={styles.divider}/>
        <View>
          {instruments.length && <>
            {instruments?.map((instrument: InstrumentType) => <InstrumentItem
              key={instrument.id} instrument={instrument} expanded/>)}
            <Divider style={styles.divider}/>
          </>}
        </View>
        <Text style={styles.scheduleHeader}>Розклад на сьогодні</Text>
        {!loading && !error ? data.schedule
          ?.map((scheduleUnit: ScheduleUnitType) => <ScheduleItem scheduleUnit={scheduleUnit}/>) :
          <ActivityIndicator animating={true} color='#2e287c' />}
        <Divider style={styles.divider}/>
        {!occupied
          ? <Text style={styles.freeText}>{occupiedOnSchedule ? 'Зайнято за розкладом' : 'Вільно'}</Text>
          : <Surface style={{elevation: visible ? 0 : 4, ...styles.occupationInfo}} onTouchEnd={showModal}>
            <Text style={styles.occupantName}>{userFullName}</Text>
            <Text style={{
              backgroundColor: UserTypeColors[occupied.user.type as UserTypes],
              ...styles.occupantType
            }}
            >
              {UserTypesUa[occupied.user.type as UserTypes]}
            </Text>
            <Text style={styles.occupiedUntil}>Зайнято до {getTimeHHMM(new Date(occupied.until))}</Text>
            <UserInfo userId={occupied.user.id} hideModal={hideModal} visible={visible}/>
          </Surface>}
      </View>
  </View>
};

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: '#2e287c',
  },
  wrapper: {
    marginTop: 100,
    marginLeft: 16,
    marginRight: 16,
  },
  divider: {
    marginTop: 16,
    marginBottom: 16
  },
  department: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center'
  },
  tags: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tag: {
    marginRight: 8
  },
  description: {
    fontSize: 16,
  },
  scheduleHeader: {
    textAlign: 'center',
    marginBottom: 16,
  },
  occupationInfo: {
    borderRadius: 8,
    padding: 16
  },
  freeText: {
    textAlign: 'center',
    fontSize: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    borderStyle: 'solid',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 32,
    color: '#bbb'
  },
  occupantName: {
    textAlign: 'center',
    fontSize: 16,
  },
  occupantType: {
    color: '#fff',
    textAlign: 'center',
    alignSelf: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginTop: 8,
    borderRadius: 4,
  },
  occupiedUntil: {
    textAlign: 'center',
    marginTop: 8
  }
});