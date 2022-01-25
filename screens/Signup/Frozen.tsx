import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ImageBackground} from "react-native";
import {Button, Title} from "react-native-paper";
import {client} from "../../api/client";
import {GET_USER_BY_ID} from "../../api/operations/queries/users";
import {getItem, removeItem, setItem} from "../../api/asyncStorage";
import {globalErrorVar, meVar} from "../../api/localClient";

export default function Frozen() {
  const message1 = 'Ваш акаунт заблоковано. Для отримання доступу разблокуйте аккаунт в учбовій частині. Ваш номер:';
  const message2 = 'Після разблокування оновіть сторінку або поверніться на сторінку входу.';
  const [storageUser, setStorageUser] = useState<any>(null);
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getItem('user').then(u => setStorageUser(u));
  },[]);

  useEffect(() => {
    if (storageUser) {
      setIsLoading(true);
      client.query({
        query: GET_USER_BY_ID,
        variables: {
          where: {id: storageUser.id}
        },
        fetchPolicy: 'network-only',
      }).then(({data: {user}}) => {
        setItem('user', user).then(() => {
          setIsLoading(false);
        });
      }).catch((e: any) => globalErrorVar(e.message));
    }
  }, [update]);

  const navigateToLogin = async () => {
    await removeItem('user');
    meVar(null);
  };

  return <ImageBackground source={require('../../assets/images/bg.jpg')}
                          style={{width: '100%', height: '100%'}}>
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Title style={styles.title}>Акаунт заблоковано</Title>
        <Text style={styles.message}>{message1}</Text>
        <Title style={styles.number}>{storageUser ? storageUser.id : ''}</Title>
        <Text style={styles.message}>{message2}</Text>
        <Button mode='contained' style={styles.button} loading={isLoading} disabled={isLoading}
                onPress={() => setUpdate(prevState => !prevState)}
        >
          Оновити
        </Button>
        <Button mode='contained' style={styles.button} onPress={navigateToLogin}>
          На сторінку входу
        </Button>
      </View>
    </View>
  </ImageBackground>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: 'transparent',
    elevation: 0
  },
  wrapper: {},
  title: {
    textAlign: 'center',
    fontSize: 32,
    padding: 10,
    lineHeight: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15
  },
  number: {
    textAlign: 'center',
    fontSize: 50,
    padding: 30,
    lineHeight: 60,
    marginHorizontal: 20,
    marginBottom: 12,
    color: '#fff',
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: '#ffffff33',
    borderWidth: 1,
  },
  message: {
    textAlign: 'center',
    borderRadius: 8,
    backgroundColor: '#b5e3ff77',
    padding: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 20,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: 10,
    height: 50,
    justifyContent: 'center'
  }
});
