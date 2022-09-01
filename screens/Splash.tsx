import React from 'react';
import {ImageBackground, Image, View, Text} from "react-native";
import {ProgressBar} from "react-native-paper";

export default function Splash() {

  return (
    <ImageBackground source={require('./../assets/images/bg.jpg')} style={{
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Image source={require('./../assets/images/au_logo_shadow.png')} style={{
        width: '80%',
        resizeMode: 'contain',
        height: 130,
      }}/>
      <View style={{width: '70%', marginTop: 40}}>
        <ProgressBar indeterminate color='#fff'/>
        <Text style={{color: '#fff'}}>2022</Text>
      </View>
    </ImageBackground>
  )
};
