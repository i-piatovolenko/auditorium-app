import React from 'react';
import {StyleSheet, View, Text, ImageBackground, Dimensions, Image} from "react-native";
import {Appbar, Title} from "react-native-paper";
import {DrawerActions} from "@react-navigation/native";

const windowHeight = Dimensions.get('window').height;

const FAQ = ({navigation}: any) => (
  <ImageBackground source={require('../assets/images/bg.jpg')}
                   style={{width: '100%', height: windowHeight}}>
    <Appbar style={styles.top}>
      <Appbar.Action icon={() => <Image source={require('../assets/images/burger.png')}
                                        style={styles.menuIcon}/>}
                     onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                     color='#fff'
      />
      <Appbar.Content
        title='Допомога' color='#fff'
      />
    </Appbar>
    <View style={styles.wrapper}>
      <Title style={styles.whiteText}>Є запитання?</Title>
      <Text style={styles.marginBottomWhiteText}>auditorium.knmau@gmail.com</Text>
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: 'transparent',
  },
  wrapper: {
    marginTop: 100,
    marginLeft: 16,
    marginRight: 16,
  },
  marginBottomWhiteText: {
    marginBottom: 10,
    color: '#fff'
  },
  whiteText: {
    color: '#fff'
  },
  menuIcon: {
    marginLeft: 3,
    marginTop: 3,
    width: 20,
    height: 20
  }
});

export default FAQ;
