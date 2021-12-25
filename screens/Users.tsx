import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";
import useUsers from "../hooks/useUsers";
import {ActivityIndicator, Appbar, DataTable, Searchbar} from "react-native-paper";
import {User, UserTypes, UserTypesUa} from "../models/models";
import {fullName, isTeacherType} from "../helpers/helpers";
import UserInfo from "../components/UserInfo";
import {DrawerActions, useNavigation} from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

export default function Users() {
  const navigation = useNavigation();
  const users = useUsers();
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [visible, setVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [searchText, setSearchText] = useState('');

  const userElement = (user: User) => {
    return (
      <DataTable.Row key={user.id} onPress={() => showModal(user.id)}>
        <DataTable.Cell>{fullName(user)}</DataTable.Cell>
        <DataTable.Cell>{UserTypesUa[user.type as UserTypes]}</DataTable.Cell>
      </DataTable.Row>
    )
  };

  const showModal = (userId: number) => {
    setVisible(true);
    setCurrentUserId(userId);
  };

  const hideModal = () => setVisible(false);

  const filterSearched = (user: User) => fullName(user).toLowerCase().includes(searchText.toLowerCase());

  useEffect(() => {
    setPages(Math.floor(users.filter(filterSearched).length / 13));
  }, [users, searchText]);

  return <ImageBackground source={require('../assets/images/bg.jpg')}
                          style={{width: '100%', height: windowHeight}}>
    <Appbar style={styles.top}>
      <Appbar.Action icon={() => <Image source={require('../assets/images/burger.png')}
                                        style={styles.menuIcon}/>}
                     onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                     color='#fff'
      />
      <Appbar.Content
        title='Довідник' color='#fff'
      />
    </Appbar>
    <Searchbar
      placeholder="Пошук"
      onChangeText={text => {
        setSearchText(text);
        setCurrentPage(0);
      }}
      value={searchText}
      style={styles.search}
    />
    <DataTable style={styles.dataTable}>
      {users.length ? <>
        <DataTable.Header style={styles.header}>
          <DataTable.Title>П.І.Б.</DataTable.Title>
          <DataTable.Title style={{alignSelf: 'center'}}>Статус</DataTable.Title>
        </DataTable.Header>
        <ScrollView style={styles.usersList}>
          {users?.filter(user => !user.nameTemp && isTeacherType(user.type as UserTypes))
            .slice()
            //@ts-ignore
            .sort((a, b) => fullName(a).toLowerCase() > fullName(b).toLowerCase())
            .filter(filterSearched)
            .slice(currentPage * 13, (currentPage * 13) + 13)
            .map(user => userElement(user))}
        </ScrollView>
        <DataTable.Pagination
          style={styles.pagination}
          page={currentPage}
          numberOfPages={pages}
          onPageChange={page => page < pages && setCurrentPage(page)}
          label={`Стр. ${currentPage + 1} з ${pages.toFixed(0)}`}
        />
      </> : (
        <View style={styles.loadingIndicatorWrapper}>
          <ActivityIndicator animating={true} color='#2e287c' style={styles.loadingIndicator}/>
        </View>
      )}
    </DataTable>
    {currentUserId ? <UserInfo userId={currentUserId} hideModal={hideModal} visible={visible}/> : null}
  </ImageBackground>
}

const styles = StyleSheet.create(({
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingTop: 26,
    height: 80,
    backgroundColor: 'transparent',
  },
  search: {
    marginTop: 80,
    borderRadius: 0
  },
  header: {
    marginTop: 0,
  },
  list: {
    height: windowHeight - 175
  },
  pagination: {
    justifyContent: 'center',
  },
  dataTable: {
    backgroundColor: '#fff'
  },
  menuIcon: {
    marginLeft: 3,
    marginTop: 3,
    width: 20,
    height: 20
  },
  loadingIndicatorWrapper: {
    backgroundColor: '#fff',
    height: '100%',
  },
  loadingIndicator: {
    paddingVertical: 24
  },
  usersList: {
    height: windowHeight - 220,
  },
}));
