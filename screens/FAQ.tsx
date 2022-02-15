import React from 'react';
import {StyleSheet, View, Text, ImageBackground, Dimensions, Image, Linking} from "react-native";
import {Appbar, Divider, Title} from "react-native-paper";
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
      <Title style={styles.whiteText}>Є запитання? Переходь за посиланнями:</Title>
      <Text
        style={styles.marginBottomWhiteText}
        onPress={() => Linking.openURL('https://www.facebook.com/auditoriumApplication')}
      >
        Технічна підтримка на сторінці Facebook
      </Text>
      <Text
        style={styles.marginBottomWhiteText}
        onPress={() => Linking.openURL('https://docs.google.com/document/d/11h6mm8OEQaG2kNODZXHHWkV1cAt5iCTdaRQ4iE6M5SU/edit')}
      >
        Інструкція користування
      </Text>
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
    marginVertical: 5,
    color: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
  },
  whiteText: {
    color: '#fff',
    marginBottom: 30,
  },
  menuIcon: {
    marginLeft: 3,
    marginTop: 3,
    width: 20,
    height: 20
  }
});

export default FAQ;
