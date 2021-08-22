import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from "react-native";
import {Appbar, Divider, Title} from "react-native-paper";
import {useQuery} from "@apollo/client";
import {GET_ME} from "../api/operations/queries/me";
import {fullName} from "../helpers/helpers";
import {UserTypes, UserTypesUa} from "../models/models";
import {getItem} from "../api/asyncStorage";

export default function Profile({navigation}: any) {
  const {data: {me}} = useQuery(GET_ME);

  const goBack = () => navigation.goBack();

  return (
    <View>
      <Appbar style={styles.top}>
        <Appbar.BackAction onPress={goBack}/>
        <Appbar.Content
          title='Мій профіль'
        />
      </Appbar>
      <View style={styles.wrapper}>
        <Title>П.І.Б.</Title>
        <Text style={{marginBottom: 10}}>{fullName(me)}</Text>
        <Divider/>
        <Title>Персональний номер (ID)</Title>
        <Text style={{marginBottom: 10}}>{me.id}</Text>
        <Divider/>
        <Title>Тип аккаунту</Title>
        <Text style={{marginBottom: 10}}>{UserTypesUa[me.type as UserTypes]}</Text>
        <Divider/>
        {me.department && (
          <>
            <Title>Кафедра</Title>
            <Text style={{marginBottom: 10}}>{me.department?.name}</Text>
            <Divider/>
          </>
        )}
        <Title>E-mail</Title>
        <Text style={{marginBottom: 10}}>{me.email}</Text>
        <Divider/>
        <Title>Телефон</Title>
        <Text style={{marginBottom: 10}}>{me.phoneNumber}</Text>
        <Divider/>
        <Title>Термін дії аккаунту</Title>
        <Text style={{marginBottom: 10}}>{me.expireDate}</Text>
        <Divider/>
      </View>
    </View>
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
    backgroundColor: '#2e287c',
  },
  wrapper: {
    marginTop: 100,
    marginLeft: 16,
    marginRight: 16,
  },
});