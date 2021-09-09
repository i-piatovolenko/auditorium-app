import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {ActivityIndicator} from "react-native-paper";
import {ClassroomType, DisabledState, Mode, OccupiedState, User, UserQueueState} from "../../models/models";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "../../types";
import ClassroomInfo from "../../components/ClassroomInfo";
import {useQuery} from "@apollo/client";
import ClassroomsBrowser from "../../components/ClassroomsBrowser/ClassroomsBrowser";
import {GET_CLASSROOMS, GET_CLASSROOMS_NO_SCHEDULE} from "../../api/operations/queries/classrooms";
import {FOLLOW_CLASSROOMS} from "../../api/operations/subscriptions/classrooms";
import {GET_USER_BY_ID, GET_USERS} from "../../api/operations/queries/users";
import {FOLLOW_USER} from "../../api/operations/subscriptions/user";
import {getItem} from "../../api/asyncStorage";
import {hasOwnClassroom, isEnabledForCurrentDepartment, isEnabledForQueue} from "../../helpers/helpers";
import Buttons from "./Buttons";
import {useLocal} from "../../hooks/useLocal";
import {client, modeVar, noConnectionVar} from "../../api/client";
import ClassroomsAppBar from "./ClassroomsAppBar";
import Log from "../../components/Log";
import {usePrevious} from "../../hooks/usePrevious";
import InlineDialog from "../../components/InlineDialog";
import QueueOutDialog from "../../components/QueueOutDialog";
import {sendPushNotification} from "../PushNotification";
import {useNavigation} from '@react-navigation/native';
import {GENERAL_QUEUE_SIZE} from "../../api/operations/queries/generalQueueSize";
import ErrorDialog from "../../components/ErrorDialog";
import ReturnToQueueDialog from "../../components/ReturnToQueueDialog";
import SkippedClassroomSnackbar from "../../components/SkippedClassroomSnackbar";
import ClassroomAcceptedDialog from "../../components/ClassroomAcceptedDialog";

const Stack = createStackNavigator<RootStackParamList>();

const windowHeight = Dimensions.get("window").height;

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const appState = useRef(AppState.currentState);
  const {data: {me}} = useLocal('me');

  useEffect(() => {
    getItem('user').then((data: User) => setCurrentUserId(data.id));
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    }
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      try {
        client.query({
          query: GET_CLASSROOMS,
          fetchPolicy: 'network-only'
        });
        client.query({
          query: GET_USER_BY_ID,
          variables: {
            where: {
              id: me.id
            }
          },
          fetchPolicy: 'network-only'
        });
        client.query({
          query: GENERAL_QUEUE_SIZE,
          fetchPolicy: 'network-only'
        });
      } catch (e) {
        console.log(e)
      }
    }

    appState.current = nextAppState;
  };

  if (!currentUserId) return null;
  // @ts-ignore
  return <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='ClassroomsList'>
    <Stack.Screen
      name={'ClassroomsList' as any}
      component={ClassroomsList}
      initialParams={{currentUserId}}
    />
    <Stack.Screen
      name={'ClassroomInfo' as any}
      component={ClassroomInfo}
      initialParams={{currentUserId}}
    />
  </Stack.Navigator>
}

type QueryClassroomsData = {
  classrooms: ClassroomType[];
}

const ClassroomsList: React.FC = ({route}: any) => {
  const {data: {mode}} = useLocal('mode');
  const {data: {noConnection}} = useLocal('noConnection');
  const navigation = useNavigation();
  const {data: {pushNotificationToken}} = useLocal('pushNotificationToken');
  const {data: {skippedClassroom}} = useLocal('skippedClassroom');
  const [showLog, setShowLog] = useState(false);
  const [freeClassroomsAmount, setFreeClassroomsAmount] = useState(0);
  const [showQueueInSuccess, setShownQueueInSuccess] = useState(false);
  const [showQueueOutSuccess, setShownQueueOutSuccess] = useState(false);
  const {
    data,
    loading,
    error,
    subscribeToMore
  } = useQuery<QueryClassroomsData>(GET_CLASSROOMS_NO_SCHEDULE);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    subscribeToMore: subscribeToMoreUser
  } = useQuery(GET_USER_BY_ID, {
    variables: {
      where: {
        id: route.params.currentUserId
      }
    }
  });
  const prevUserData: { user: User } = usePrevious(userData);
  const prevClassroomsData: { classrooms: ClassroomType[] } = usePrevious(data);

  useEffect(() => {
    if (userData && prevUserData) {
      const {currentSession} = userData.user?.queueInfo;
      const {currentSession: prevSession} = prevUserData.user?.queueInfo;
      if (!prevSession && currentSession?.state === UserQueueState.IN_QUEUE_MINIMAL) {
        setShownQueueInSuccess(true);
      }
      if (!currentSession &&
        (prevSession?.state === UserQueueState.IN_QUEUE_MINIMAL ||
          prevSession?.state === UserQueueState.IN_QUEUE_DESIRED_AND_OCCUPYING)) {
        setShownQueueOutSuccess(true);
      }
    }
  }, [userData]);

  // useEffect(() => {
  //   if (data && prevClassroomsData && userData) {
  //     data.classrooms.forEach(({occupied, id, name}) => {
  //       const prevClassroomOccupiedData = prevClassroomsData.classrooms
  //         .find((classroom) => classroom.id === id)?.occupied;
  //       if (prevClassroomOccupiedData.user?.id !== occupied.user?.id && occupied.state === OccupiedState.PENDING
  //         && occupied.user?.id === userData.user.id) {
  //         sendPushNotification(pushNotificationToken, `Аудиторія ${name} звільнена.`,
  //           `Ви маєте 2 хв. щоб зарезервувати або пропустити ії.`);
  //       }
  //     })
  //   }
  // }, [data, userData]);

  useEffect(() => {
    const unsubscribeClassrooms = subscribeToMore({
      document: FOLLOW_CLASSROOMS,
    });
    const unsubscribeUser = subscribeToMoreUser({
      document: FOLLOW_USER,
      variables: {
        userId: route.params.currentUserId
      }
    });
    return () => {
      unsubscribeClassrooms();
      unsubscribeUser();
    };
  }, []);

  useEffect(() => {
    if (!loading && !error && userData) {
      const freeClassrooms = data.classrooms.filter(classroom => {
        return classroom.occupied.state === OccupiedState.FREE
          && classroom.disabled.state === DisabledState.NOT_DISABLED
          && isEnabledForCurrentDepartment(classroom, userData.user);
      });
      setFreeClassroomsAmount(freeClassrooms.length);
    }
  }, [data, userData]);

  useEffect(() => {
    if (userData) {
      if (!!userData.user?.queue.length) modeVar(Mode.INLINE);
      if (!userData.user?.queue.length && mode === Mode.INLINE) modeVar(Mode.PRIMARY);
    }
  }, [userData]);

  /**
   * Find occupied classroom for current user (OCCUPIED or RESERVED)
   * */
  const own = ({id}: ClassroomType) => {
    return id === hasOwnClassroom(userData.user.occupiedClassrooms);
  };

  /**
   * Filter classrooms for primary state (not in queue and not in queue setup)
   * Hidden shown when is occupied
   * Without occupied by current user
   * */
  const primary = (classroom: ClassroomType) => {
    const ownClassroomId = hasOwnClassroom(userData.user.occupiedClassrooms);
    const fullHidden = classroom.occupied.state === OccupiedState.FREE && classroom.isHidden;

    return classroom.id !== ownClassroomId && !fullHidden &&
      !(userData.user.occupiedClassrooms.some((data: any) => {
        return data.classroom.id === classroom.id && data.state === OccupiedState.PENDING
      }));
  };

  /**
   * From BE queue data
   * Filter chosen classrooms in queue setup mode (MINIMAl and DESIRED)
   * */
  const chosen = (classroom: ClassroomType) => {

    return userData.user.queue.some(({classroom: {id}, ...queueRecord}: any) => classroom.id === id)
      && !(userData.user.occupiedClassrooms.some(({id}: ClassroomType) => classroom.id === id));
  };

  /**
   * Others not in queue classrooms
   * */
  const notChosen = (classroom: ClassroomType) => {
    const ownClassroomId = hasOwnClassroom(userData.user.occupiedClassrooms);

    return !(userData.user.queue.some(({classroom: {id}}: any) => classroom.id === id)) &&
      classroom.id !== ownClassroomId;
  };

  /**
   * Filter action pending classrooms for current user
   * */
  const pending = ({id}: ClassroomType) => {
    return userData.user.occupiedClassrooms.some((data: any) => {
      return data.classroom.id === id && data.state === OccupiedState.PENDING
    });
  };

  const handleShowLog = () => {
    setShowLog(prevState => !prevState);
  }

  const handleReload = () => {
    try {
      client.query({
        query: GET_CLASSROOMS,
        fetchPolicy: 'network-only'
      });
      client.query({
        query: GET_USER_BY_ID,
        variables: {
          where: {
            id: route.params.currentUserId
          }
        },
        fetchPolicy: 'network-only'
      });
      client.query({
        query: GENERAL_QUEUE_SIZE,
        fetchPolicy: 'network-only'
      });
      noConnectionVar(false);
    } catch (e) {

    }
  }

  return noConnection ? (
    <ErrorDialog visible={noConnection}
                 hideDialog={handleReload}
                 message="Немає з'єднання з інтернетом"
                 buttonText='Перезавантажити'
    />
  ) : (
    <ImageBackground source={require('../../assets/images/bg.jpg')}
                     style={{width: '100%', height: windowHeight}}>
      {!userLoading && !userError && (
        <>
          <InlineDialog visible={showQueueInSuccess}
                        hideDialog={() => setShownQueueInSuccess(false)}
          />
          <QueueOutDialog visible={showQueueOutSuccess}
                          hideDialog={() => setShownQueueOutSuccess(false)}
          />
        </>
      )}
      {mode !== Mode.QUEUE_SETUP && (
        <TouchableOpacity style={styles.hiddenLogButton} onLongPress={handleShowLog}
                          delayLongPress={3000}>
        </TouchableOpacity>
      )}
      {!loading && !error && !userLoading && !userError && (
        <ClassroomsAppBar freeClassroomsAmount={freeClassroomsAmount} classrooms={data.classrooms}
                          currentUser={userData.user}
        />
      )}

      <View style={styles.wrapper}>
        {showLog && (
          <Log data={JSON.stringify({...userData.user.queueInfo, ...userData.user.queue})}/>
        )}
        {!loading && !error && !userLoading && !userError && (
          <ScrollView style={styles.scrollView}>
            {/**
             My classroom: OCCUPIED or RESERVED classroom by current user
             Shown anytime except QUEUE_SETUP mode.
             */}
            {mode !== Mode.QUEUE_SETUP && (
              <ClassroomsBrowser classrooms={data.classrooms.filter(own)} currentUser={userData.user}
                                 title='Моя аудиторія'
              />
            )}

            {/**
             Pending classroom: PENDING for approval by current user
             Shown in QUEUED mode
             */}
            {mode === Mode.INLINE && (
              <ClassroomsBrowser classrooms={data.classrooms.filter(pending)} currentUser={userData.user}
                                 title='Аудиторії, що очікують підтвердження'
              />
            )}

            {/**
             Classrooms browser shown when current user is not in queue
             Shown all classrooms except classrooms of current user (OCCUPIED, PENDING and RESERVED)
             and hidden and FREE at same time
             */}
            {mode === Mode.PRIMARY && (
              <ClassroomsBrowser classrooms={data.classrooms.filter(primary)} currentUser={userData.user}
                                 title='Всі аудиторії'
              />
            )}

            {/**
             Classrooms browser shown when current user is in QUEUE_SETUP mode
             Shown all classrooms except classrooms of current user (OCCUPIED, PENDING and RESERVED),
             hidden, free, disabled and disabled for current department
             */}
            {mode === Mode.QUEUE_SETUP && (
              <ClassroomsBrowser classrooms={data.classrooms.filter((classroom => {
                return isEnabledForQueue(classroom, userData.user);
              }))} currentUser={userData.user}/>
            )}

            {/**
             All chosen for queue classrooms when IN_QUEUE mode is enabled
             */}
            {mode === Mode.INLINE && (
              <ClassroomsBrowser classrooms={data.classrooms.filter(chosen)} currentUser={userData.user}
                                 title='Аудиторії, за якими я стою в черзі'
              />
            )}

            {/**
             All NOT chosen for queue classrooms when IN_QUEUE mode is enabled
             */}
            {mode === Mode.INLINE && (
              <ClassroomsBrowser classrooms={data.classrooms.filter(notChosen)} currentUser={userData.user}
                                 title='Інші аудиторії'
              />
            )}
          </ScrollView>
        )}
        {loading && <ActivityIndicator animating color='#fff' size={64}/>}
      </View>
      {!!userData && !loading && !error && (
        <Buttons currentUser={userData.user} classrooms={data.classrooms}/>
      )}
      {userData &&
      userData.user.queueInfo.currentSession?.state === UserQueueState.QUEUE_RESERVED_NOT_OCCUPYING && (
        <ReturnToQueueDialog
          remainingOccupationTime={userData.user.queueInfo?.currentSession?.remainingOccupationTime}
        />
      )}
      <ClassroomAcceptedDialog/>
      {skippedClassroom && userData && (
        <SkippedClassroomSnackbar skipsCount={userData.user.queueInfo.currentSession?.skips}/>
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create(
  {
    grid: {
      marginBottom: 80,
      marginLeft: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    },
    getInLine: {
      position: 'absolute',
      zIndex: 1,
      bottom: 15,
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    getOutLine: {
      position: 'absolute',
      zIndex: 1,
      bottom: 15,
      left: 20,
      width: '43%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    getOutLineSingle: {
      position: 'absolute',
      zIndex: 1,
      bottom: 15,
      width: '55%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    approve: {
      position: 'absolute',
      zIndex: 1,
      right: 20,
      bottom: 15,
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
      paddingTop: 80,
    },
    queueSwitcher: {
      flexDirection: 'row',
      width: '76%',
      justifyContent: 'center',
      paddingHorizontal: 5,
      marginHorizontal: 20,
      alignItems: 'center',
    },
    hiddenLogButton: {
      position: "absolute",
      zIndex: 1000,
      width: 100,
      height: 50,
      top: 16,
      right: 16,
    },
    scrollView: {
      paddingTop: 8,
      paddingBottom: 80
    }
  }
);