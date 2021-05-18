import React from 'react';
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
  DrawerItem,
} from '@react-navigation/drawer';

const CustomSidebarMenu = (props: any) => {

  return (
    <SafeAreaView style={{flex: 1}}>
      <Image
        source={require('../assets/images/au_logo.png')}
        style={styles.sideMenuProfileIcon}
      />
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/*<DrawerItem*/}
        {/*  label="Visit Us"*/}
        {/*  onPress={() => Linking.openURL('https://aboutreact.com/')}*/}
        {/*/>*/}
        {/*<View style={styles.customItem}>*/}
        {/*  <Text>*/}
        {/*    Rate Us*/}
        {/*  </Text>*/}
        {/*  <Image*/}
        {/*    source={{uri: BASE_PATH + 'star_filled.png'}}*/}
        {/*    style={styles.iconStyle}*/}
        {/*  />*/}
        {/*</View>*/}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 200,
    height: 70,
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
});

export default CustomSidebarMenu;