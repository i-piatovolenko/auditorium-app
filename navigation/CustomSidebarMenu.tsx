import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Avatar, Button, Dialog, IconButton, Portal} from "react-native-paper";
import {removeItem} from "../api/asyncStorage";
import {meVar} from "../api/client";

const CustomSidebarMenu = (props: any) => {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const logout = async () => {
    await removeItem('user');
    await removeItem('token');
    meVar(null);
    hideDialog();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Image
        source={require('../assets/images/au_logo.png')}
        resizeMethod='scale'
        style={styles.logo}
      />
      <View style={styles.userData}>
        <Avatar.Icon size={44} icon='account'/>
        <Text style={styles.userName}>{meVar()?.firstName}, вітаємо!</Text>
        <IconButton
          icon="logout"
          color="#f91354"
          size={30}
          onPress={showDialog}
          style={styles.logout}
        />
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: '#fff',
          marginBottom: 16
        }}
        onPress={() => Linking.openURL('https://knmau.com.ua/')}
      >
        НМАУ ім. П.І.Чайковського
      </Text>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Ви дійсно бажаєте вийти з аккаунту?</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Відміна</Button>
            <Button onPress={logout}>Так</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'stretch',
    width: 200,
    height: 63,
    marginTop: 50,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userData: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    borderColor: '#ffffff22',
    flexDirection: 'row'
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    paddingLeft: 10
  },
  logout: {
    marginRight: -10,
    marginVertical: -10
  }
});

export default CustomSidebarMenu;