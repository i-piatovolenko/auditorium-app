import React, {useEffect, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, View} from "react-native";
import {ActivityIndicator, Appbar, Button} from "react-native-paper";
import useClassrooms from "../../hooks/useClassrooms";
import {
  ClassroomType,
  InstrumentType,
  Mode,
  OccupiedState,
  QueueState,
  QueueType, SavedFilterT
} from "../../models/models";
import ClassroomsCell from "../../components/ClassroomCell";
import Filters, {SpecialT} from "./Filters";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "../../types";
import ClassroomInfo from "../../components/ClassroomInfo";
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {getClassroomsFilteredByInstruments} from "./helpers";
import {useLocal} from "../../hooks/useLocal";
import {
  client,
  desirableClassroomIdsVar,
  isMinimalSetupVar,
  meVar,
  minimalClassroomIdsVar,
  modeVar
} from "../../api/client";
import getInLine from "../../helpers/queue/getInLine";
import InlineDialog from "../../components/InlineDialog";
import ConfirmLineOut from "../../components/ConfirmLineOut";
import * as Notifications from "expo-notifications";
import {GET_CLASSROOMS} from "../../api/operations/queries/classrooms";
import {ISODateString} from "../../helpers/helpers";
import {useQuery} from "@apollo/client";
import {GET_ME} from "../../api/operations/queries/me";
import MyClassroomCell from "./MyClassroomCell";
import {GET_GENERAL_QUEUE} from "../../api/operations/queries/generalQueue";
import SavedFilters from "./SavedFilters";
import {getItem} from "../../api/asyncStorage";

const Stack = createStackNavigator<RootStackParamList>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Home() {
  // @ts-ignore
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
  const [visibleSavedFilters, setVisibleSavedFilters] = useState(false);
  const [visibleModalInline, setVisibleModalInline] = useState(false);
  const [visibleLineOut, setVisibleLineOut] = useState(false);
  const navigation = useNavigation();
  const [queueSize, setQueueSize] = useState(27);
  const [freeClassroomsAmount, setFreeClassroomsAmount] = useState(0);
  const title = queueSize ? `Людей в черзі: ${queueSize}` : `Людей в черзі немає`;
  const inlineTitle = `Ви в черзі: ${queueSize}-й`;
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const {data: {me}} = useQuery(GET_ME);

  useEffect(() => {
    client.watchQuery({
      query: GET_CLASSROOMS,
      variables: {
        date: ISODateString(new Date()),
      },
      fetchPolicy: 'network-only',
      pollInterval: 3000
    }).subscribe({
      next: ({data}) => {
      },
    });

    client.watchQuery({
      query: GET_GENERAL_QUEUE,
      fetchPolicy: 'network-only',
      pollInterval: 3000
    }).subscribe({
      next: ({data}) => {
        setQueueSize(data.generalQueue.length)
      },
    });

    if (meVar()?.queue.length) {
      const minimal = meVar()?.queue.filter(({type, state}) => {
        return type === QueueType.MINIMAL && state === QueueState.ACTIVE;
      });
      const desired = meVar()?.queue.filter(({type, state}) => {
        return type === QueueType.DESIRED && state === QueueState.ACTIVE;
      });
      modeVar(Mode.INLINE);
      minimalClassroomIdsVar(minimal ? minimal.map(({classroom: {id}}) => id) : []);
      desirableClassroomIdsVar(desired ? desired.map(({classroom: {id}}) => id) : []);
    }
  }, []);

  useEffect(() => {
    if (classrooms) {
      const myClassroom = classrooms.find(({occupied}) => {
        return occupied?.user.id === me.id && occupied?.state === OccupiedState.OCCUPIED;
      });
      meVar({...me, occupiedClassroom: myClassroom || null});
      setFreeClassroomsAmount(classrooms?.filter(classroom => !classroom.occupied).length);
    }
  }, [classrooms]);

  const showModalInline = () => setVisibleModalInline(true);

  const hideModalInline = () => setVisibleModalInline(false);

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

  const showModalSavedFilters = () => setVisibleSavedFilters(true);

  const hideModalSavedFilters = () => setVisibleSavedFilters(false);

  const showConfirmLineOut = () => setVisibleLineOut(true);

  const hideConfirmLineOut = () => setVisibleLineOut(false);

  const applyGeneralFilter = (instruments: InstrumentType[], withWing: boolean,
                              operaStudioOnly: boolean, special: SpecialT) => {

    const filteredClassroomsByInstruments = instruments.length ?
      getClassroomsFilteredByInstruments(classrooms, instruments) : classrooms;

    const filteredIds = filteredClassroomsByInstruments
      .filter(classroom => withWing ? true : !classroom.isWing)
      .filter(classroom => operaStudioOnly ? classroom.isOperaStudio : true)
      .filter(classroom => {
        switch (special) {
          case "with":
            return true;
          case "only":
            return classroom.special;
          case "without":
            return !classroom.special;
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

  const handleReady = async () => {
    await getInLine(minimalClassroomIds, desirableClassroomIds);
    showModalInline();
  };

  const getInQueueSetup = async () => {
    const savedFilters: SavedFilterT[] | undefined = await getItem('filters');
    if (savedFilters) {
      const mainFilter = savedFilters!.find(filter => filter.main);
      if (mainFilter) {
        minimalClassroomIdsVar(mainFilter.minimalClassroomIds);
        desirableClassroomIdsVar(mainFilter.desirableClassroomIds);
      }
    }
    modeVar(Mode.QUEUE_SETUP);
  };

  const handleCancelQueueSetup = () => {
    modeVar(Mode.PRIMARY);
    minimalClassroomIdsVar([]);
    desirableClassroomIdsVar([]);
    isMinimalSetupVar(true);
  }

  const filterAwaitingFreeClassrooms = () => {
    let result;
    if (classrooms) {
      result = classrooms.filter(classroom => {
        if (!classroom.occupied) {
          //TODO push notifications
        }
        return !classroom.occupied
        // && classroom.queue[0] === me.id;
      });
    }

    return result;
  }

  useEffect(() => {
    classrooms && filterAwaitingFreeClassrooms();
  }, [classrooms.filter(({occupied}) => !occupied).length]);

  const filterHiddenClassrooms = ({isHidden, occupied}: ClassroomType) => {
    return mode === Mode.PRIMARY ? (!(isHidden && !occupied)) : !isHidden;
  };

  const filterDisabledClassrooms = ({disabled}: ClassroomType) => {
    return mode === Mode.QUEUE_SETUP || mode === Mode.INLINE ? !disabled : true;
  };

  const filterMyPendingClassrooms = ({id, occupied}: ClassroomType) => {
    return minimalClassroomIds.includes(id) && occupied && (
      occupied.state === OccupiedState.PENDING || occupied.state === OccupiedState.RESERVED
    );
  }

  const filterAllAnotherClassrooms = ({id}: ClassroomType) => id !== me?.occupiedClassroom?.id;

  const filterQueuedClassrooms = ({id, occupied}: ClassroomType) => {
    return minimalClassroomIds.includes(id) && occupied && me?.id !== occupied.user.id;
  }

  return <ImageBackground source={require('../../assets/images/bg.jpg')}
                          style={{width: '100%', height: '100%'}}>
    {/*<Log data={me}/>*/}
    <Appbar style={styles.top}>
      <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                     color='#fff'
      />
      {mode === Mode.PRIMARY && (
        <Appbar.Content style={{marginLeft: -10}} title={title} subtitle={'Вільних аудиторій: ' +
        freeClassroomsAmount} color='#fff'/>
      )}
      {mode === Mode.QUEUE_SETUP && (
        <>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '88%'}}>
            <View style={styles.queueSwitcher}>
              <Button mode={isMinimalSetup ? 'contained' : 'text'}
                      style={{position: 'relative', width: '45%'}}
                      color='#fff'
                      onPress={() => isMinimalSetupVar(true)}
              >
                Мінімальні
              </Button>
              <Button
                mode={!isMinimalSetup ? 'contained' : 'text'}
                style={{position: 'relative', width: '35%'}}
                color='#fff'
                onPress={() => isMinimalSetupVar(false)}
              >
                Бажані
              </Button>
            </View>
          </View>
          <Appbar.Action icon="content-save" onPress={showModalSavedFilters} color='#fff'
                         style={{position: 'absolute', right: 40, top: 28}}/>
          <Appbar.Action icon="filter" onPress={showModal} color='#fff'
                         style={{position: 'absolute', right: 0, top: 28}}/>
        </>
      )}
      {mode === Mode.INLINE && (
        <Appbar.Content style={{marginLeft: -10}} title={inlineTitle} color='#fff'/>
      )}
    </Appbar>

    <View style={styles.wrapper}>
      {classrooms?.length ? <>

        <ScrollView>
          <MyClassroomCell me={me} classrooms={classrooms} isMinimalSetup={isMinimalSetup}
                           minimalClassroomIds={minimalClassroomIds}
                           desirableClassroomIds={desirableClassroomIds}
          />
          {(mode === Mode.PRIMARY || mode === Mode.QUEUE_SETUP || mode === Mode.OWNER) && (
            <>
              {me.occupiedClassroom && <Text style={styles.gridDivider}>
                  Всі аудиторії:
              </Text>}
              <View style={styles.grid}>
                {classrooms && classrooms
                  .filter(filterHiddenClassrooms)
                  .filter(filterDisabledClassrooms)
                  .filter(filterAllAnotherClassrooms)
                  .map(classroom => (
                      <ClassroomsCell key={classroom.id} classroom={classroom}
                                      filteredList={isMinimalSetup ? minimalClassroomIds : desirableClassroomIds}
                      />
                    )
                  )}
              </View>
            </>
          )}
          {mode === Mode.INLINE && (
            <>
              {!!classrooms.filter(filterMyPendingClassrooms)?.length && (
                <>
                  <Text style={styles.gridDivider}>
                    Аудиторії, що очікують підтвердження:
                  </Text>
                  <View style={{...styles.grid, marginBottom: 10}}>
                    {classrooms.filter(filterMyPendingClassrooms).map(classroom => (
                      <ClassroomsCell key={classroom.id} classroom={classroom}
                                      filteredList={isMinimalSetup ? minimalClassroomIds : desirableClassroomIds}
                      />
                    ))}
                  </View>
                </>
              )}
              {!!(classrooms.filter(filterQueuedClassrooms).length) && <>
                  <Text style={styles.gridDivider}>Аудиторії, за якими я стою в черзі:</Text>
                  <View style={{...styles.grid, marginBottom: 10}}>
                    {classrooms.filter(filterQueuedClassrooms).map(classroom => (
                      <ClassroomsCell key={classroom.id} classroom={classroom}
                                      filteredList={isMinimalSetup ? minimalClassroomIds : desirableClassroomIds}
                      />
                    ))}
                  </View>
              </>}
              <Text style={styles.gridDivider}>Інші аудиторії: </Text>
              <View style={styles.grid}>
                {classrooms
                  .filter(({id}) => !(minimalClassroomIds.includes(id)))
                  .filter(filterHiddenClassrooms)
                  .filter(filterDisabledClassrooms)
                  .map(classroom => (
                    <ClassroomsCell key={classroom.id} classroom={classroom}
                                    filteredList={isMinimalSetup ? minimalClassroomIds : desirableClassroomIds}
                    />
                  ))}
              </View>
            </>
          )}
        </ScrollView>

        {mode === Mode.PRIMARY && !me.occupiedClassroom && (
          <Button style={styles.getInLine} mode='contained' color='#2b5dff'
                  onPress={getInQueueSetup}>
            <Text>Стати в чергу</Text>
          </Button>
        )}
        {mode === Mode.QUEUE_SETUP && (
          <>
            <Button style={styles.approve} mode='contained' color='#2b5dff'
                    onPress={handleReady} disabled={!minimalClassroomIds.length}
            >
              <Text>Готово ({queueSize + 1}-й)</Text>
            </Button>
            <Button style={styles.getOutLine} mode='contained' color='#f91354'
                    onPress={handleCancelQueueSetup}>
              <Text>Скасувати</Text>
            </Button>
          </>
        )}
        {mode === Mode.INLINE && (
          <Button style={styles.getOutLineSingle} mode='contained' color='#f91354'
                  onPress={showConfirmLineOut}
          >
            <Text>Вийти з черги</Text>
          </Button>
        )}
      </> : <ActivityIndicator animating color='#fff'/>}
      <SavedFilters hideModal={hideModalSavedFilters} visible={visibleSavedFilters} />
      <Filters hideModal={hideModal} visible={visible} apply={applyGeneralFilter}/>
      <InlineDialog visible={visibleModalInline} hideDialog={hideModalInline}/>
      <ConfirmLineOut hideDialog={hideConfirmLineOut} visible={visibleLineOut}/>
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
    }
    ,
    grid: {
      marginBottom: 80,
      marginLeft: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    }
    ,
    getInLine: {
      position: 'absolute',
      zIndex: 1,
      bottom: 90,
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    }
    ,
    getOutLine: {
      position: 'absolute',
      zIndex: 1,
      bottom: 90,
      left: 20,
      width: '43%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    }
    ,
    getOutLineSingle: {
      position: 'absolute',
      zIndex: 1,
      bottom: 90,
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    }
    ,
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
    }
    ,
    wrapper: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      marginTop: 80,
      paddingBottom: 70,
    }
    ,
    queueSwitcher: {
      flexDirection: 'row',
      width: '76%',
      justifyContent: 'center',
      paddingHorizontal: 5,
      marginHorizontal: 20,
      alignItems: 'center',
    }
    ,
    gridDivider: {
      color: '#fff',
      marginBottom: 10,
      marginLeft: 3,
      marginRight: 3,
      paddingLeft: 17,
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff77',
      paddingBottom: 10
    }
  }
  )
;