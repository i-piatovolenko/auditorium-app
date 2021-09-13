import React from 'react';
import {View, Text, StyleSheet} from "react-native";
import {ActivityIndicator, Divider, Modal, Portal, Title} from "react-native-paper";
import {fullName, isTeacherType} from "../helpers/helpers";
import {useQuery} from "@apollo/client";
import {GET_USER_BY_ID} from "../api/operations/queries/users";
import {UserTypes, UserTypesUa} from "../models/models";
import {Linking} from 'react-native'

interface PropTypes {
  userId: number;
  hideModal: () => void;
  visible: boolean;
}

export default function UserInfo({userId, hideModal, visible}: PropTypes) {
  const {data, loading, error} = useQuery(GET_USER_BY_ID, {
    variables: {where: {id: userId}}
  });

  const openPhoneNumber = (phoneNumber: string) => Linking.openURL(`tel:${phoneNumber}`);

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      {!loading && !error ? <>
          <Title style={styles.occupantName}>{fullName(data.user)}</Title>
          <Divider style={styles.divider}/>
          <Text>Статус: {UserTypesUa[data.user.type as UserTypes]}</Text>
          <Text>Кафедра: {data.user.department?.name}</Text>
          <Divider style={styles.divider}/>
        {isTeacherType(data.user.type) && <>
            <View style={styles.phoneRow}><Text>Тел: </Text>
                <Text onPress={() => openPhoneNumber(data.user.phoneNumber)} style={styles.phoneNumber}>
                  {data.user.phoneNumber}
                </Text>
            </View>
          {JSON.parse(data.user.extraPhoneNumbers).map((number: string, index: number) => {
            return <View key={index} style={styles.phoneRow}>
              <Text>{`Тел. ${index + 2}: `}</Text>
              <Text onPress={() => openPhoneNumber(number)} style={styles.phoneNumber}>
                {number}
              </Text>
            </View>
          })}
        </>}
      </> : <ActivityIndicator animating={true} color='#2e287c'/>}
    </Modal>
  </Portal>
};

const styles = StyleSheet.create(({
  occupantName: {},
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 8
  },
  divider: {
    marginTop: 16,
    marginBottom: 16
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  phoneNumber: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#eee',
    padding: 8,
    fontSize: 16,
    marginTop: 8,
    color: '#2b5dff'
  }
}));