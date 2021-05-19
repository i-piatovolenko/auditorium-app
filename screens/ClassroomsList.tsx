import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from "react-native";
import {ActivityIndicator, Appbar, Button} from "react-native-paper";
import useClassrooms from "../hooks/useClassrooms";
import {ClassroomType} from "../models/models";
import ClassroomsCell from "../components/ClassroomCell";
import Filters from "../components/Filters";
import {useNavigation} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "../types";
import ClassroomInfo from "../components/ClassroomInfo";

const Stack = createStackNavigator<RootStackParamList>();

export default function Home() {
  return <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='ClassroomsList'>
    <Stack.Screen
      name='ClassroomsList'
      component={ClassroomsList}
    />
    <Stack.Screen
      name='ClassroomInfo'
      component={ClassroomInfo}
    />
  </Stack.Navigator>
}

function ClassroomsList() {
  const classrooms: ClassroomType[] = useClassrooms(true);
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  return <>
    <Appbar style={styles.top}>
      <Appbar.Action icon="menu" onPress={() => {}}/>
      <Appbar.Action icon="eye" onPress={() => showModal()}/>
      <Appbar.Content title="Всі аудиторії"/>
      <Appbar.Action icon="filter" onPress={() => showModal()}/>
    </Appbar>
    <View style={styles.wrapper}>
      {classrooms?.length ? <>
        <ScrollView>
          <View style={styles.grid}>
            {classrooms?.map(classroom => <ClassroomsCell key={classroom.id} classroom={classroom}/>)}
          </View>
        </ScrollView>
        <Button style={styles.getInLine} mode='contained' color='#2b5dff' onPress={showModal}>
          <Text>Стати в чергу (27-й)</Text>
        </Button>
      </> : <ActivityIndicator animating={true} color='#2e287c'/>}
      <Filters hideModal={hideModal} visible={visible}/>
    </View>
  </>
};

const styles = StyleSheet.create(
  {
    top: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      paddingTop: 26,
      height: 80,
      backgroundColor: '#2e287c',
      zIndex: 1
    },
    grid: {
      marginTop: 80,
      marginBottom: 80,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    getInLine: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 50,
      justifyContent: 'center',
    },
    wrapper: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }
  )
;