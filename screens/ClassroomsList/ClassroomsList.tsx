import React, {useEffect, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, View} from "react-native";
import {ActivityIndicator, Appbar, Button} from "react-native-paper";
import useClassrooms from "../../hooks/useClassrooms";
import {ClassroomType} from "../../models/models";
import ClassroomsCell from "../../components/ClassroomCell";
import Filters, {SpecialT} from "./Filters";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "../../types";
import ClassroomInfo from "../../components/ClassroomInfo";
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';

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
  const classrooms: ClassroomType[] = useClassrooms();
  const [visible, setVisible] = useState(false);
  const [visibleShowOnly, setVisibleShowOnly] = useState(false);
  const [inlineClassrooms, setInlineClassrooms] = useState<number[]>([]);
  const [freeCounter, setFreeCounter] = useState(0);
  const navigation = useNavigation();
  const [isQueueSetup, setIsQueueSetup] = useState(false);
  const [queueClassroomIds, setQueueClassroomIds] = useState<number[]>([]);
  const [queueSize, setQueueSize] = useState(27);
  const [title, setTitle] = useState(`Людей в черзі: ${queueSize}`);
  const [isMinimal, setIsMinimal] = useState(true);
  const [minimalClassroomIds, setMinimalClassroomIds] = useState<number[]>([]);
  const [desirableClassroomIds, setDesirableClassroomIds] = useState<number[]>([]);

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  const showModalShowOnly = () => setVisibleShowOnly(true);

  const hideModalShowOnly = () => setVisibleShowOnly(false);

  const addToFilteredList = (classroomId: number) => {
   if (isMinimal) {
      // @ts-ignore
      const elementIndex = minimalClassroomIds.findIndex((id) => id === classroomId);

      if (elementIndex === -1) {
        setMinimalClassroomIds(prevState => [...prevState, classroomId]);
      } else {
        const filteredArray = minimalClassroomIds.slice();

        filteredArray.splice(elementIndex, 1);
        setMinimalClassroomIds(filteredArray);
      }
    } else {
     // @ts-ignore
     const elementIndex = desirableClassroomIds.findIndex((id) => id === classroomId);

     if (elementIndex === -1) {
       setDesirableClassroomIds(prevState => [...prevState, classroomId]);
     } else {
       const filteredArray = desirableClassroomIds.slice();

       filteredArray.splice(elementIndex, 1);
       setDesirableClassroomIds(filteredArray);
     }
   }
  };

  const setAllWithoutWing = (value: boolean) => {
    if (value) {
      const allIdsWithoutWing = classrooms?.filter(classroom => !classroom.isWing).map(({id}) => id);

      if (isMinimal) {
        setMinimalClassroomIds(allIdsWithoutWing);
      } else {
        setDesirableClassroomIds(allIdsWithoutWing);
      }
    } else {
      setAll();
    }
  };

  const setOnlyOperaStudio = (value: boolean) => {

  };

  const apply = (instruments: number[] | null, withWing: boolean,
                 operaStudioOnly: boolean, special: SpecialT) => {

  };

  const setAll = () => {
    const allIds = classrooms.map(({id}) => id);

    if (isMinimal) {
      setMinimalClassroomIds(allIds);
    } else {
      setDesirableClassroomIds(allIds);
    }
  };

  return <ImageBackground source={require('../../assets/images/bg.jpg')}
                          style={{width: '100%', height: '100%'}}>
    <Appbar style={styles.top}>
      <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} color='#fff'/>
      {!isQueueSetup ? (
        <Appbar.Content style={{marginLeft: -10}} title={title} subtitle={'Вільних аудиторій: ' +
        classrooms?.filter(classroom => !classroom.occupied).length} color='#fff'/>
      ) : (
        <>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '88%'}}>
          <View style={styles.queueSwitcher}>
            <Button mode={isMinimal ? 'contained' : 'text'}
                    style={{position: 'relative', width: '50%'}}
                    color='#fff'
                    onPress={() => setIsMinimal(true)}
            >
              Мінімальні
            </Button>
            <Button
              mode={!isMinimal ? 'contained' : 'text'}
              style={{position: 'relative', width: '50%'}}
              color='#fff'
              onPress={() => setIsMinimal(false)}
            >
              Бажані
            </Button>
          </View>
        </View>
        <Appbar.Action icon="content-save" onPress={showModal} color='#fff'
                       style={{position: 'absolute', right: 40, top: 28}}/>
        <Appbar.Action icon="filter" onPress={showModal} color='#fff'
                       style={{position: 'absolute', right: 0, top: 28}}/>
        </>
      )}
    </Appbar>
    <View style={styles.wrapper}>
      {classrooms?.length ? <>
        <ScrollView>
          <View style={styles.grid}>
            {classrooms?.map(classroom => <ClassroomsCell key={classroom.id} classroom={classroom}
              isQueueSetup={isQueueSetup} addToFilteredList={addToFilteredList}
              filteredList={isMinimal ? minimalClassroomIds: desirableClassroomIds}
            />)}
          </View>
        </ScrollView>
        {!isQueueSetup ? (
          <Button style={styles.getInLine} mode='contained' color='#2b5dff'
                  onPress={() => setIsQueueSetup(true)}>
            <Text>Стати в чергу ({queueSize + 1}-й)</Text>
          </Button>
        ) : (
          <>
            <Button style={styles.approve} mode='contained' color='#2b5dff'
                    onPress={() => setIsQueueSetup(true)}>
              <Text>Готово ({queueSize + 1}-й)</Text>
            </Button>
            <Button style={styles.getOutLine} mode='contained' color='#f91354'
                    onPress={() => setIsQueueSetup(false)}>
              <Text>Скасувати</Text>
            </Button>
          </>
        )}
      </> : <ActivityIndicator animating={true} color='#fff'/>}
      <Filters hideModal={hideModal} visible={visible} apply={apply}/>
    </View>
  </ImageBackground>
}

const styles = StyleSheet.create(
  {
    top: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      paddingTop: 26,
      height: 80,
      backgroundColor: 'transparent',
      zIndex: 1
    },
    grid: {
      marginBottom: 80,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    getInLine: {
      position: 'absolute',
      zIndex: 1,
      bottom: 90,
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    getOutLine: {
      position: 'absolute',
      zIndex: 1,
      left: 20,
      bottom: 90,
      width: '43%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    approve: {
      position: 'absolute',
      zIndex: 1,
      right: 20,
      bottom: 90,
      width: '43%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    wrapper: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      marginTop: 80,
      paddingBottom: 70,
    },
    queueSwitcher: {
      flexDirection: 'row',
      width: '76%',
      justifyContent: 'space-between',
      paddingHorizontal: 5,
      marginHorizontal: 20,
      alignItems: 'center',
    },
  });