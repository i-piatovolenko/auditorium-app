import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from "react-native";
import {client} from "../api/client";
import {GET_USER_BY_ID} from "../api/operations/queries/users";
import {setItem} from "../api/asyncStorage";

export default function Profile() {
  const [storageUser, setStorageUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      });
    }
  }, []);

  return <View>
    <Text>Profile</Text>
  </View>
}

const styles = StyleSheet.create({

});