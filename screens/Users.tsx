import React from 'react';
import {StyleSheet, View, Text} from "react-native";
import useUsers from "../hooks/useUsers";
import {DataTable} from "react-native-paper";

export default function Users() {
  const users = useUsers();

  return <View>
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>П.І.Б.</DataTable.Title>
        <DataTable.Title numeric>Статус</DataTable.Title>
        <DataTable.Title numeric>Fat</DataTable.Title>
      </DataTable.Header>

      <DataTable.Row>
        <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        <DataTable.Cell numeric>159</DataTable.Cell>
        <DataTable.Cell numeric>6.0</DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
        <DataTable.Cell numeric>237</DataTable.Cell>
        <DataTable.Cell numeric>8.0</DataTable.Cell>
      </DataTable.Row>

      <DataTable.Pagination
        page={1}
        numberOfPages={3}
        onPageChange={page => {
          console.log(page);
        }}
        label="1-2 of 6"
      />
    </DataTable>
  </View>
}

const styles = StyleSheet.create(({

}));
