import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ImageBackground, Dimensions, Image, Linking, ScrollView} from "react-native";
import {Appbar, Button, Divider, Title} from "react-native-paper";
import {useQuery} from "@apollo/client";
import {GET_ME} from "../api/operations/queries/me";
import {fullName} from "../helpers/helpers";
import {UserTypes, UserTypesUa} from "../models/models";
import {DrawerActions} from "@react-navigation/native";
import {client} from "../api/client";
import {GET_USER_BY_ID} from "../api/operations/queries/users";
import Loading from "./Loading";
import moment from "moment";
import Colors from "../constants/Colors";
import {globalErrorVar} from "../api/localClient";

const windowHeight = Dimensions.get('window').height;

export default function Profile({navigation}: any) {
  const {data: {me}} = useQuery(GET_ME);
  const [currentUser, setCurrentUser] = useState(null);

  const handleChangePassword = () => {
    navigation.navigate('UpdatePassword');
  };

  useEffect(() => {
    if (me) {
      try {
        client.query({
          query: GET_USER_BY_ID,
          variables: {
            where: {
              id: me.id
            }
          }
        }).then(result => {
          setCurrentUser(result.data.user)
        })
      } catch (e: any) {
        globalErrorVar(e.message);
      }
    }
  }, [me]);

  return (
    <ImageBackground source={require('../assets/images/bg.jpg')}
                     style={{width: '100%', height: windowHeight + 80}}>
      <Appbar style={styles.top}>
        <Appbar.Action icon={() => <Image source={require('../assets/images/burger.png')}
                                          style={styles.menuIcon}/>}
                       onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                       color='#fff'
        />
        <Appbar.Content
          title='Мій профіль' color='#fff'
        />
      </Appbar>
      {currentUser ? (
        <ScrollView contentContainerStyle={styles.wrapper} style={styles.scrollView}>
          {currentUser.queueInfo.sanctionedUntil ? <View style={styles.sanctionsMessage}>
            <Title style={styles.sanctionsMessageText}>Увага!</Title>
            <Divider style={{backgroundColor: '#ffffff', marginVertical: 5,}}/>
            <Text style={styles.sanctionsMessageText}>
              На ваш профіль накладені санкції до ${
              moment(currentUser.queueInfo.sanctionedUntil).format('DD-MM-YYYY HH:mm')}
            </Text>
          </View> : null}
          <Title style={styles.whiteText}>П.І.Б.</Title>
          <Text style={styles.marginBottomWhiteText}>{fullName(currentUser)}</Text>
          <Divider style={{backgroundColor: '#ffffff33'}}/>
          <Title style={styles.whiteText}>Персональний номер (ID)</Title>
          <Text style={styles.marginBottomWhiteText}>{currentUser.id}</Text>
          <Divider style={{backgroundColor: '#ffffff33'}}/>
          <Title style={styles.whiteText}>Тип акаунту</Title>
          <Text style={styles.marginBottomWhiteText}>{UserTypesUa[currentUser.type as UserTypes]}</Text>
          <Divider style={{backgroundColor: '#ffffff33'}}/>
          {currentUser.department && (
            <>
              <Title style={styles.whiteText}>Кафедра</Title>
              <Text style={styles.marginBottomWhiteText}>{currentUser.department?.name}</Text>
              <Divider style={{backgroundColor: '#ffffff33'}}/>
            </>
          )}
          <Title style={styles.whiteText}>E-mail</Title>
          <Text style={styles.marginBottomWhiteText}>{currentUser.email}</Text>
          <Divider style={{backgroundColor: '#ffffff33'}}/>
          <Title style={styles.whiteText}>Телефон</Title>
          <Text style={styles.marginBottomWhiteText}>{currentUser.phoneNumber}</Text>
          <Divider style={{backgroundColor: '#ffffff33'}}/>
          <Title style={styles.whiteText}>Термін дії акаунту</Title>
          <Text style={styles.marginBottomWhiteText}>{moment(currentUser.expireDate).format('YYYY-MM-DD')}</Text>
          <Divider style={{backgroundColor: '#ffffff33'}}/>
          <Button
            style={styles.changePasswordButton}
            onPress={handleChangePassword}
            mode='contained'
          >Змінити пароль</Button>
        </ScrollView>
      ) : (
        <Loading/>
      )}
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
    zIndex: 1000
  },
  wrapper: {
    marginLeft: 16,
    marginRight: 16,
    paddingBottom: 8,
    marginTop: 10,
    backgroundColor: '#ffffff22',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  scrollView: {
    marginTop: 80,
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
    height: 20,
  },
  changePasswordButton: {
    marginTop: 20,
  },
  sanctionsMessage: {
    backgroundColor: Colors.red,
    borderRadius: 6,
    padding: 20,
    marginBottom: 20,
    elevation: 10,
  },
  sanctionsMessageText: {
    color: '#fff'
  }
});
