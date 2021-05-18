import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from "react-native";
import useUsers from "../hooks/useUsers";
import {DataTable} from "react-native-paper";
import {UserTypes, UserTypesUa} from "../models/models";
import {fullName, isTeacherType} from "../helpers/helpers";

export default function Users() {
  const users = useUsers();
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const UserElement = ({user}: any) => <DataTable.Row>
    <DataTable.Cell>{fullName(user)}</DataTable.Cell>
    <DataTable.Cell>{UserTypesUa[user.type as UserTypes]}</DataTable.Cell>
  </DataTable.Row>

  useEffect(() => {
    setPages(users.length / 13)
  }, [users]);

  return <View>
    <DataTable>
      <DataTable.Header style={styles.header}>
        <DataTable.Title>П.І.Б.</DataTable.Title>
        <DataTable.Title numeric>Статус</DataTable.Title>
      </DataTable.Header>
      <View style={styles.list}>
        <ScrollView>
          {users?.filter(user => isTeacherType(user.type as UserTypes)).slice(currentPage, currentPage+13).map(user => <UserElement user={user}/>)}
        </ScrollView>
      </View>
      <DataTable.Pagination
        style={styles.pagination}
        page={currentPage}
        numberOfPages={pages}
        onPageChange={page => {
          setCurrentPage(page);
        }}
        label={`${currentPage*13} - ${(currentPage*13)+13} з ${users.length}`}
      />
    </DataTable>
  </View>
}

const styles = StyleSheet.create(({
  header: {
    marginTop: 40
  },
  list: {
    height: '82%'
  },
  pagination: {
    justifyContent: 'center',
  }
}));
