import React from 'react';
import {StyleSheet, Text, ImageBackground, View} from "react-native";
import {ProgressBar} from "react-native-paper";

export default function Loading() {

  return (
    <ImageBackground source={require('../assets/images/bg.jpg')} style={styles.background}>
      <Text style={styles.text}>Loading...</Text>
      <View style={{width: '70%', marginTop: 40}}>
        <ProgressBar indeterminate color='#fff'/>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24
  }
});