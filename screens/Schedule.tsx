import React, {useState} from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions} from "react-native";
import {Appbar, Surface, TextInput} from "react-native-paper";
import {ActivityTypes, ClassroomType} from "../models/models";
import {fullName, ISODateString} from "../helpers/helpers";
import {GET_SCHEDULE} from "../api/operations/queries/schedule";
import {useQuery} from "@apollo/client";
import UserInfo from "../components/UserInfo";

const windowWidth = Dimensions.get('window').width;

export default function Schedule() {
  const timeline = ['', 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const {data, loading, error} = useQuery(GET_SCHEDULE, {
    variables: {date: ISODateString(new Date())}
  });
  const hour = (windowWidth - 40) / (timeline.length - 1);
  const [visible, setVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);

  const showModal = (userId: number) => {
    setCurrentUserId(userId);
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  return <>
    <Appbar style={styles.top}>
      <Appbar.Action icon="menu" onPress={() => {}}/>
      <Appbar.Content title="Розклад"/>
      <Appbar.Action icon="calendar-range" onPress={() => {}}/>
    </Appbar>
    <View style={styles.timeline} pointerEvents='none'>
      {timeline.slice(1).map(item => <Text style={{width: hour, ...styles.hour}}>{item}</Text>)}
    </View>
    <ScrollView style={styles.schedule}>
      {!loading && !error && (data.classrooms as ClassroomType[])?.slice().sort((a, b) => {
        return a.name - b.name
      }).map(classroom => {
        let lastValue = timeline[1] as number;
        return <View style={styles.row}>
          <Text style={{width: 40, textAlign: 'center'}}>{classroom.name}</Text>
          {classroom.schedule.slice().sort((a, b) => {
            return parseInt(a.from) - parseInt(b.from)
          }).map(unit => {
            const from = parseInt(unit.from);
            const to = parseInt(unit.to);
            const length = (to - from) * hour;
            const gap = (from - lastValue) * hour;
            lastValue = to;
            return <View style={{flexDirection: 'row'}} onTouchEnd={() => showModal(unit.user.id)}>
              <View style={{...styles.gap, width: gap}}/>
              <Surface style={{
                ...styles.item,
                width: length,
                backgroundColor: unit.activity === ActivityTypes.INDIVIDUAL_LESSON ? '#2b5dff' : '#ffc000'
              }}>
                <Text style={{color: '#fff'}} numberOfLines={1}>
                  {fullName(unit.user, true)}
                </Text>
              </Surface>
            </View>
          })}
        </View>
      })}
    </ScrollView>
    {currentUserId ? <UserInfo userId={currentUserId} hideModal={hideModal} visible={visible}/> : null}
  </>
};

const styles = StyleSheet.create({
  timeline: {
    marginTop: 90,
    height: '100%',
    marginLeft: 40,
    flexDirection: 'row',
    position: 'absolute',
    elevation: 10,
  },
  hour: {
    borderLeftColor: 'rgba(221 ,221 ,221, .2)',
    borderLeftWidth: 1
  },
  schedule: {
    marginTop: 120,
  },
  row: {
    flexDirection: 'row',
    borderBottomColor: 'rgba(221 ,221 ,221, .5)',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  gap: {
    height: 40,
  },
  item: {
    borderRadius: 4,
    elevation: 4,
    margin: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
    flexWrap: 'nowrap'
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: '#2e287c',
    zIndex: 1
  },
});