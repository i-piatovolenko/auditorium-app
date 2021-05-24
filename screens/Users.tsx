import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, Dimensions} from "react-native";
import useUsers from "../hooks/useUsers";
import {ActivityIndicator, DataTable, Searchbar} from "react-native-paper";
import {UserTypes, UserTypesUa} from "../models/models";
import {fullName, isTeacherType} from "../helpers/helpers";
import UserInfo from "../components/UserInfo";

const windowHeight = Dimensions.get('window').height;

export default function Users() {
  const users = useUsers();
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(0);
  const [searchText, setSearchText] = useState('');
  const UserElement = ({user}: any) => <DataTable.Row onPress={() => showModal(user.id)}>
    <DataTable.Cell>{fullName(user)}</DataTable.Cell>
    <DataTable.Cell>{UserTypesUa[user.type as UserTypes]}</DataTable.Cell>
  </DataTable.Row>;

  const showModal = (userId: number) => {
    setVisible(true);
    setCurrentUserId(userId);
  };

  const hideModal = () => setVisible(false);

  useEffect(() => {
    setPages(users.length / 13)
  }, [users]);

  return <View>
    <Searchbar
      placeholder="Пошук"
      onChangeText={text => {
        setSearchText(text);
        setCurrentPage(0);
      }}
      value={searchText}
      style={styles.search}
    />
    <DataTable>
      <DataTable.Header style={styles.header}>
        <DataTable.Title>П.І.Б.</DataTable.Title>
        <DataTable.Title style={{alignSelf: 'center'}}>Статус</DataTable.Title>
      </DataTable.Header>
      {users.length ? <>
        <View style={styles.list}>
          <ScrollView>
            {users?.filter(user => isTeacherType(user.type as UserTypes))
              .slice()
              //@ts-ignore
              .sort((a , b) => fullName(a).toLowerCase() > fullName(b).toLowerCase())
              .filter(user => fullName(user).toLowerCase().includes(searchText.toLowerCase()))
              .slice(currentPage * 13, (currentPage * 13) + 13)
              .map(user =>
              <UserElement user={user}/>)}
          </ScrollView>
        </View>
        <DataTable.Pagination
          style={styles.pagination}
          page={currentPage}
          numberOfPages={pages}
          onPageChange={page => {
            setCurrentPage(page);
          }}
          label={`${currentPage * 13} - ${(currentPage * 13) + 13} з ${users.length}`}
        />
      </> : <ActivityIndicator animating={true} color='#2e287c'/>}
    </DataTable>
    {currentUserId ? <UserInfo userId={currentUserId} hideModal={hideModal} visible={visible}/> : null}
  </View>
}

const styles = StyleSheet.create(({
  search: {
    marginTop: 40,
    marginBottom: -40
  },
  header: {
    marginTop: 40,
  },
  list: {
    height: windowHeight - 175
  },
  pagination: {
    justifyContent: 'center',
  }
}));
