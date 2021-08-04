import React from 'react';
import {View, Text, StyleSheet, Image} from "react-native";
import {Divider, Modal, Portal, Title} from "react-native-paper";
import {fullName, isTeacherType} from "../helpers/helpers";
import {useQuery} from "@apollo/client";
import {GET_USER_BY_ID} from "../api/operations/queries/users";
import {InstrumentType, UserTypes, UserTypesUa} from "../models/models";
import {Linking} from 'react-native'

interface PropTypes {
  instrument: InstrumentType;
  hideModal: () => void;
  visible: boolean;
  imageSource: string;
}

export default function InstrumentInfo({instrument, hideModal, visible}: PropTypes) {
  let instrumentType: any = `./../assets/images/UpRightPiano.png`;
  // @ts-ignore
  const intRate = Math.round(instrument.rate);
  const rate = new Array(10).fill(1);

  switch (instrument.type) {
    case 'Chembalo':
      instrumentType = <Image source={require(`./../assets/images/Chembalo.png`)} style={styles.icon}/>;
      break;
    case 'GrandPiano':
      instrumentType = <Image source={require(`./../assets/images/GrandPiano.png`)} style={styles.icon}/>;
      break;
    case 'UpRightPiano':
      instrumentType = <Image source={require(`./../assets/images/UpRightPiano.png`)} style={styles.icon}/>;
      break;
    default:
      instrumentType = <Image source={require(`./../assets/images/GrandPiano.png`)} style={styles.icon}/>;
  }

  return <Portal>
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
      <Title style={{textAlign: 'center'}}>{instrumentType} {instrument.name}</Title>
      <Divider style={styles.divider}/>
      <Text style={{textAlign: 'center'}}>Тип: {instrument.type}</Text>
      <Divider style={styles.divider}/>
      <Text style={{textAlign: 'center'}}>Рейтинг: {instrument.rate.toFixed(1)}</Text>
      <View style={styles.rate}>
        {rate.map((item, index) => <Image key={index}
          style={{...styles.star, opacity: index < intRate ? 1 : .3}}
          source={require('../assets/images/star.png')}
        />)}
      </View>
    </Modal>
  </Portal>
};

const styles = StyleSheet.create(({
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
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    marginLeft: 4,
    opacity: .6
  },
  star: {
    width: 20,
    height: 20
  },
  rate: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center'
  }
}));