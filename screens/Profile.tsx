import React from 'react';
import {StyleSheet, View, Text, ImageBackground, Dimensions} from "react-native";
import {Appbar, Divider, Title} from "react-native-paper";
import {useQuery} from "@apollo/client";
import {GET_ME} from "../api/operations/queries/me";
import {fullName} from "../helpers/helpers";
import {UserTypes, UserTypesUa} from "../models/models";
import {DrawerActions} from "@react-navigation/native";

const windowHeight = Dimensions.get('window').height;

export default function Profile({navigation}: any) {
  const {data: {me}} = useQuery(GET_ME);

  return (
    <ImageBackground source={require('../assets/images/bg.jpg')}
                     style={{width: '100%', height: windowHeight}}>
      <Appbar style={styles.top}>
        <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                       color='#fff'
        />
        <Appbar.Content
          title='Мій профіль' color='#fff'
        />
      </Appbar>
      <View style={styles.wrapper}>
        <Title style={styles.whiteText}>П.І.Б.</Title>
        <Text style={styles.marginBottomWhiteText}>{fullName(me)}</Text>
        <Divider style={{backgroundColor: '#ffffff33'}}/>
        <Title style={styles.whiteText}>Персональний номер (ID)</Title>
        <Text style={styles.marginBottomWhiteText}>{me.id}</Text>
        <Divider style={{backgroundColor: '#ffffff33'}}/>
        <Title style={styles.whiteText}>Тип аккаунту</Title>
        <Text style={styles.marginBottomWhiteText}>{UserTypesUa[me.type as UserTypes]}</Text>
        <Divider style={{backgroundColor: '#ffffff33'}}/>
        {me.department && (
          <>
            <Title style={styles.whiteText}>Кафедра</Title>
            <Text style={styles.marginBottomWhiteText}>{me.department?.name}</Text>
            <Divider style={{backgroundColor: '#ffffff33'}}/>
          </>
        )}
        <Title style={styles.whiteText}>E-mail</Title>
        <Text style={styles.marginBottomWhiteText}>{me.email}</Text>
        <Divider style={{backgroundColor: '#ffffff33'}}/>
        <Title style={styles.whiteText}>Телефон</Title>
        <Text style={styles.marginBottomWhiteText}>{me.phoneNumber}</Text>
        <Divider style={{backgroundColor: '#ffffff33'}}/>
        <Title style={styles.whiteText}>Термін дії аккаунту</Title>
        <Text style={styles.marginBottomWhiteText}>{me.expireDate}</Text>
        <Divider style={{backgroundColor: '#ffffff33'}}/>
      </View>
    </ImageBackground>
  )
}

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
  }
});