import React, {useState} from 'react';
import {View, StyleSheet, Text, Dimensions, Image} from "react-native";
import {ClassroomType, InstrumentType} from "../models/models";
import InstrumentInfo from "./InstrumentInfo";

interface PropTypes {
  instrument: InstrumentType;
  expanded?: boolean;
}

export default function InstrumentItem({instrument, expanded = false}: PropTypes) {
  const {type, rate, name} = instrument;
  let instrumentType: any = `./../assets/images/UpRightPiano.png`;
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  switch (type) {
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

  return <View style={styles.wrapper} onTouchEnd={showModal}>
    {instrumentType}
    {expanded && <>
        <Text style={styles.name}>{name}</Text>
        <Image style={styles.star} source={require('../assets/images/star.png')}/>
    </>}
    <Text>{rate.toFixed(1)}</Text>
    <InstrumentInfo instrument={instrument} hideModal={hideModal} visible={visible}
                    imageSource={instrumentType}/>
  </View>
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    marginRight: 2,
    backgroundColor: 'rgba(0, 0, 0, .05)',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    paddingRight: 8,
    borderRadius: 4,
    alignItems: 'center'
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
    marginLeft: 4,
    opacity: .6
  },
  name: {
    marginLeft: 4,
    marginRight: 4
  },
  star: {
    width: 20,
    height: 20
  }
});