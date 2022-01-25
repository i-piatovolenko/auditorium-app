import {View, StyleSheet, Text, ScrollView, Dimensions, TextInput, Image} from "react-native";
import React, {useEffect, useState} from "react";
import {UserTypes} from "../models/models";
import {maxDistanceVar} from "../api/localClient";

export default function Log({data}: any) {
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    if (text === UserTypes.ADMIN) {
      maxDistanceVar(10000.750)
      setVisibility(true);
      setTimeout(() => {
        setVisibility(false);
      }, 3000)
    }
  }, [text]);

  return JSON.stringify(data).length > 2 ?
    <>
      {( visibility &&
        <Image source={require('../assets/images/rjk.png')} style={{
          position: 'absolute', zIndex: 999999, width: 121, height: 234
        }}/>
        )}
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.text}>
          {typeof data === 'object' ? JSON.stringify(data) : data}
        </Text>
        <TextInput onChangeText={(text) => setText(text)} value={text}/>
      </ScrollView>
    </View>
    </>
    : <></>
}

const styles = StyleSheet.create({
  container: {
    width: '50%',
    backgroundColor: '#00000099',
    position: 'absolute',
    zIndex: 99999999,
    top: 70,
    elevation: 1000,
    right: 16,
    padding: 16,
    maxHeight: (Dimensions.get('window').height / 100) * 85
  },
  text: {
    color: '#00ff65'
  }
});
