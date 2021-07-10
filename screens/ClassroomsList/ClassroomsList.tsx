import React, {useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, View} from "react-native";
import {ActivityIndicator, Appbar, Button} from "react-native-paper";
import useClassrooms from "../../hooks/useClassrooms";
import {ClassroomType, InstrumentType, Mode} from "../../models/models";
import ClassroomsCell from "../../components/ClassroomCell";
import Filters, {SpecialT} from "./Filters";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "../../types";
import ClassroomInfo from "../../components/ClassroomInfo";
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {getClassroomsFilteredByInstruments} from "./helpers";
import Inline from "../Inline";
import {useLocal} from "../../hooks/useLocal";
import {desirableClassroomIdsVar, isMinimalSetupVar, minimalClassroomIdsVar, modeVar} from "../../api/client";
import getInLine from "../../helpers/queue/getInLine";

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
    <Stack.Screen
      name='Inline'
      component={Inline}
    />
  </Stack.Navigator>
}

function ClassroomsList() {
  const classrooms: ClassroomType[] = useClassrooms();
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const [queueSize, setQueueSize] = useState(27);
  const [title, setTitle] = useState(`Людей в черзі: ${queueSize}`);
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  const applyGeneralFilter = (instruments: InstrumentType[], withWing: boolean,
                 operaStudioOnly: boolean, special: SpecialT) => {

    const filteredClassroomsByInstruments = instruments.length ?
      getClassroomsFilteredByInstruments(classrooms, instruments) : classrooms;

    const filteredIds = filteredClassroomsByInstruments
      .filter(classroom => withWing ? true : !classroom.isWing)
      .filter(classroom => operaStudioOnly ? classroom.isOperaStudio : true)
      .filter(classroom => {
        switch (special) {
          case "with": return true;
          case "only": return classroom.special;
          case "without": return !classroom.special;
        }
      })
      .map(classroom => classroom.id);

    if (isMinimalSetup) {
      minimalClassroomIdsVar(filteredIds);
    } else {
      desirableClassroomIdsVar(filteredIds);
    }
  };

  const setAll = () => {
    const allIds = classrooms.map(({id}) => id);

    if (isMinimalSetup) {
      minimalClassroomIdsVar(allIds);
    } else {
      desirableClassroomIdsVar(allIds);
    }
  };

  return <ImageBackground source={require('../../assets/images/bg.jpg')}
                          style={{width: '100%', height: '100%'}}>
    <Appbar style={styles.top}>
      <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} color='#fff'/>
      {mode === Mode.PRIMARY ? (
        <Appbar.Content style={{marginLeft: -10}} title={title} subtitle={'Вільних аудиторій: ' +
        classrooms?.filter(classroom => !classroom.occupied).length} color='#fff'/>
      ) : (
        <>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '88%'}}>
          <View style={styles.queueSwitcher}>
            <Button mode={isMinimalSetup ? 'contained' : 'text'}
                    style={{position: 'relative', width: '50%'}}
                    color='#fff'
                    onPress={() => isMinimalSetupVar(true)}
            >
              Мінімальні
            </Button>
            <Button
              mode={!isMinimalSetup ? 'contained' : 'text'}
              style={{position: 'relative', width: '50%'}}
              color='#fff'
              onPress={() => isMinimalSetupVar(false)}
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
              filteredList={isMinimalSetup ? minimalClassroomIds: desirableClassroomIds}
            />)}
          </View>
        </ScrollView>
        {mode === Mode.PRIMARY ? (
          <Button style={styles.getInLine} mode='contained' color='#2b5dff'
                  onPress={() => modeVar(Mode.QUEUE_SETUP)}>
            <Text>Стати в чергу ({queueSize + 1}-й)</Text>
          </Button>
        ) : (
          <>
            <Button style={styles.approve} mode='contained' color='#2b5dff'
                    onPress={() => getInLine(minimalClassroomIds, desirableClassroomIds)}>
              <Text>Готово ({queueSize + 1}-й)</Text>
            </Button>
            <Button style={styles.getOutLine} mode='contained' color='#f91354'
                    onPress={() => modeVar(Mode.PRIMARY)}>
              <Text>Скасувати</Text>
            </Button>
          </>
        )}
      </> : <ActivityIndicator animating color='#fff'/>}
      <Filters hideModal={hideModal} visible={visible} apply={applyGeneralFilter}/>
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