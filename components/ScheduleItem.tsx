import React, {useState} from "react";
import {View, StyleSheet, Text} from "react-native";
import {ActivityTypes, ScheduleUnitType} from "../models/models";
import {fullName} from "../helpers/helpers";
import UserInfo from "./UserInfo";

interface PropTypes {
  scheduleUnit: ScheduleUnitType;
}

export default function ScheduleItem({scheduleUnit}: PropTypes) {
  const {user, activity, from, to} = scheduleUnit;
  const isLecture = activity === ActivityTypes.LECTURE;
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

    return <>
      <Text style={[styles.item, isLecture ? styles.lecture : styles.individual]} onPress={showModal}>
         {from + ' - ' + to + ' ' + fullName(user, true)}
      </Text>
      <UserInfo userId={user.id} hideModal={hideModal} visible={visible}/>
    </>;
}

const styles = StyleSheet.create(({
  item: {
    marginTop: 4,
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  individual: {
    backgroundColor: '#2b5dff',
    color: '#fff'
  },
  lecture: {
    backgroundColor: '#ffc000',
    color: '#000'
  }
}));