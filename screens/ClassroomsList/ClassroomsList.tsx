import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  AppStateStatus,
  Dimensions,
  ImageBackground,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet, Text,
  TouchableOpacity,
  View
} from "react-native";
import {ActivityIndicator} from "react-native-paper";
import {
  ClassroomType,
  CrashModeT,
  DisabledState,
  Mode,
  OccupiedState,
  Platforms,
  User,
  UserQueueState
} from "../../models/models";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "../../types";
import ClassroomInfo from "../../components/ClassroomInfo";
import {useQuery} from "@apollo/client";
import ClassroomsBrowser from "../../components/ClassroomsBrowser/ClassroomsBrowser";
import {GET_CLASSROOMS, GET_CLASSROOMS_WITH_SCHEDULE} from "../../api/operations/queries/classrooms";
import {FOLLOW_CLASSROOMS} from "../../api/operations/subscriptions/classrooms";
import {GET_USER_BY_ID} from "../../api/operations/queries/users";
import {FOLLOW_USER} from "../../api/operations/subscriptions/user";
import {getItem, setItem} from "../../api/asyncStorage";
import {isEnabledForCurrentDepartment, isEnabledForQueue} from "../../helpers/helpers";
import Buttons from "./Buttons";
import {useLocal} from "../../hooks/useLocal";
import {client} from "../../api/client";
import ClassroomsAppBar from "./ClassroomsAppBar";
import Log from "../../components/Log";
import {usePrevious} from "../../hooks/usePrevious";
import InlineDialog from "../../components/InlineDialog";
import QueueOutDialog from "../../components/QueueOutDialog";
import {GENERAL_QUEUE_SIZE} from "../../api/operations/queries/generalQueueSize";
import ErrorDialog from "../../components/ErrorDialog";
import ReturnToQueueDialog from "../../components/ReturnToQueueDialog";
import ClassroomAcceptedDialog from "../../components/ClassroomAcceptedDialog";
import {GET_GENERAL_QUEUE} from "../../api/operations/queries/generalQueue";
import Space from "../../components/Space";
import {MAX_DISTANCE} from "../../api/operations/queries/constant";
import WarningDialog from "../../components/WarningDialog";
import {isLastVersion} from "../../helpers/isLastVersion";
import {GET_GLOBAL_MESSAGES} from "../../api/operations/queries/globalMessages";
import {CURRENT_TEST_VERSION} from "../../constants/constants";
import {FOLLOW_CRASH_MODE} from "../../api/operations/subscriptions/crashModeUpdate";
import {CRASH_MODE} from "../../api/operations/queries/crashMode";
import CrashModeAlert from "../../components/ClassroomsBrowser/CrashModeAlert";
import {DISPATCHER_STATUS} from "../../api/operations/queries/dispatcherActive";
import {FOLLOW_DISPATCHER_STATUS} from "../../api/operations/subscriptions/dispatcherStatus";
import moment from "moment";
import {globalErrorVar, maxDistanceVar, modeVar, noConnectionVar} from "../../api/localClient";

const Stack = createStackNavigator<RootStackParamList>();

const WINDOW_HEIGHT = Dimensions.get("window").height;
const BOTTOM_SPACE = 80;

type CrashModeDataT = {
  crashMode: CrashModeT;
  crashModeUpdate: CrashModeT;
};

export default function Home() {
  const appState = useRef(AppState.currentState);
  const {data: {me}} = useLocal('me');

  useEffect(() => {
    client.query({
      query: MAX_DISTANCE
    }).then(res => {
      const distance = res.data.constant.value;
      if (distance) {
        maxDistanceVar(distance);
      }
    });
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    }
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active' &&
      me.id
    ) {
      try {
        client.query({
          query: DISPATCHER_STATUS,
          fetchPolicy: 'network-only'
        });
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
      } catch (e: any) {
        console.log(e)
      }
    }

    appState.current = nextAppState;
  };

  if (!me) return null;
  // @ts-ignore
  return <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='ClassroomsList'>
    <Stack.Screen
      name={'ClassroomsList' as any}
      component={ClassroomsList}
      initialParams={{currentUserId: me.id}}
    />
    <Stack.Screen
      name={'ClassroomInfo' as any}
      component={ClassroomInfo}
      initialParams={{currentUserId: me.id}}
    />
  </Stack.Navigator>
}

type QueryClassroomsData = {
  classrooms: ClassroomType[];
}

const ClassroomsList: React.FC = ({route}: any) => {
  const {data: {mode}} = useLocal('mode');
  const {data: {me}} = useLocal('me');
  const {data: {noConnection}} = useLocal('noConnection');
  const {data: {skippedClassroom}} = useLocal('skippedClassroom');
  const [showLog, setShowLog] = useState(false);
  const [freeClassroomsAmount, setFreeClassroomsAmount] = useState(0);
  const [showQueueInSuccess, setShownQueueInSuccess] = useState(false);
  const [showQueueOutSuccess, setShownQueueOutSuccess] = useState(false);
  const [globalMessage, setGlobalMessage] = useState(null);
  const [crashMode, setCrashMode] = useState(false);
  const [crashModeComment, setCrashModeComment] = useState('');
  const [crashModeUntil, setCrashModeUntil] = useState('');
  const [dispatcherActive, setDispatcherActive] = useState(true);
  const {
    data,
    loading,
    error,
    subscribeToMore,
    refetch: refetchClassrooms
  } = useQuery<QueryClassroomsData>(GET_CLASSROOMS_WITH_SCHEDULE, {
    fetchPolicy: 'network-only',
    variables: {
      date: moment().endOf('day').toISOString()
    }
  });
  const {
    data: crashModeData,
    subscribeToMore: subscribeToMoreCrashMode
  } = useQuery<CrashModeDataT>(CRASH_MODE);
  const {
    data: dispatcherStatusData,
    subscribeToMore: subscribeToMoreDispatcherStatus,
  } = useQuery(DISPATCHER_STATUS);
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    subscribeToMore: subscribeToMoreUser,
    refetch: refetchUsers
  } = useQuery(GET_USER_BY_ID, {
    fetchPolicy: 'network-only',
    variables: {
      where: {
        id: me.id
      }
    }
  });
  const prevUserData: { user: User } = usePrevious(userData);
  const [refreshing, setRefreshing] = React.useState(false);
  const [latestVersion, setLatestVersion] = useState([true, '', '']);

  const onRefresh =async () => {
    setRefreshing(true);
    try {
      await client.subscribe({
        query: FOLLOW_USER,
        variables: {
          userId: me.id
        }
      })
      await client.query({
        query: GET_CLASSROOMS_WITH_SCHEDULE,
        fetchPolicy: 'network-only',
        variables: {
          date: moment().endOf('day').toISOString()
        }
      });
      await refetchUsers()
      await client.query({
        query: GET_GENERAL_QUEUE,
        fetchPolicy: 'network-only'
      });
      setRefreshing(false);
    } catch (e: any) {
      globalErrorVar(e.message);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (crashModeData) {
      setCrashMode(crashModeData.crashMode.isActive);
      setCrashModeComment(crashModeData.crashMode.comment);
      setCrashModeUntil(crashModeData.crashMode.until as unknown as string);
    }
  }, [crashModeData])
  useEffect(() => {
    if (dispatcherStatusData) {
      setDispatcherActive(dispatcherStatusData.dispatcherActive);
    }
  }, [dispatcherStatusData])

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
    if (userData) {
      if (!!userData.user?.queue.length) modeVar(Mode.INLINE);
      if (!userData.user?.queue.length && mode === Mode.INLINE) modeVar(Mode.PRIMARY);
    }
  }, [userData]);

  useEffect(() => {
    isLastVersion().then(res => {
      setLatestVersion(res);
    });
    try {
    client.query({
      query: GET_GLOBAL_MESSAGES
    }).then((result) => {
      const messages = result.data.globalMessages;
      if (messages?.length) {
        getItem('lastGlobalMessage').then(res => {
          if (res !== messages[0].body) {
            setGlobalMessage(messages[0]);
          } else {
            setGlobalMessage(null);
          }
        });
      }
    });
    } catch (e: any) {
      globalErrorVar(e.message);
    }
      const unsubscribeClassrooms = subscribeToMore({
        document: FOLLOW_CLASSROOMS,
      });
      const unsubscribeCrashMode = subscribeToMoreCrashMode({
        document: FOLLOW_CRASH_MODE,
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) return prev;
          setCrashMode(subscriptionData.data.crashModeUpdate.isActive);
          setCrashModeComment(subscriptionData.data.crashModeUpdate.comment);
          setCrashModeUntil(subscriptionData.data.crashModeUpdate.until as unknown as string);
          return subscriptionData.data;
        }
      });
      const unsubscribeDispatcherStatus = subscribeToMoreDispatcherStatus({
        document: FOLLOW_DISPATCHER_STATUS,
        updateQuery: (prev, {subscriptionData}) => {
          if (!subscriptionData.data) return prev;
          setDispatcherActive(subscriptionData.data.dispatcherActiveUpdate);
          return subscriptionData.data;
        }
      });
      const unsubscribeUser = subscribeToMoreUser({
        document: FOLLOW_USER,
        variables: {
          userId: me.id
        },
      })
      return () => {
        unsubscribeClassrooms();
        unsubscribeUser();
        unsubscribeCrashMode();
        unsubscribeDispatcherStatus()
      };
  }, []);

  useEffect(() => {
    if (!loading && !error && userData) {
      const freeClassrooms = data.classrooms.filter(classroom => {
        return classroom.occupied.state === OccupiedState.FREE
          && classroom.disabled.state === DisabledState.NOT_DISABLED
          && isEnabledForCurrentDepartment(classroom, userData.user)
          && !classroom.isHidden;
      });
      setFreeClassroomsAmount(freeClassrooms.length);
    }
  }, [data, userData]);

  /**
   * Find occupied classroom for current user (OCCUPIED or RESERVED)
   * */
  const own = ({id}: ClassroomType) => {
    return userData.user.occupiedClassrooms?.some(({classroom}: any) => classroom.id === id);
  };

  /**
   * Filter classrooms for primary state (not in queue and not in queue setup)
   * Hidden shown when is occupied
   * Without occupied by current user
   * */
  const primary = (classroom: ClassroomType) => {
    const fullHidden = classroom.occupied.state === OccupiedState.FREE && classroom.isHidden;

    return !own(classroom) && !fullHidden;
  };

  /**
   * From BE queue data
   * Filter chosen classrooms in queue setup mode (MINIMAl and DESIRED)
   * */
  const chosen = (classroom: ClassroomType) => {

    return userData.user.queue.some(({classroom: {id}, ...queueRecord}: any) => classroom.id === id)
      && !own(classroom)
      && !(classroom.occupied?.user?.id === userData?.user?.id && classroom.occupied.state === OccupiedState.PENDING);
  };

  /**
   * Others not in queue classrooms
   * */
  const notChosen = (classroom: ClassroomType) => {
    const fullHidden = classroom.occupied.state === OccupiedState.FREE && classroom.isHidden;

    return !(userData.user.queue.some(({classroom: {id}}: any) => classroom.id === id))
      && !fullHidden && !own(classroom);
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

  const handleReload = async () => {
    try {
      await client.resetStore();
    } catch (e: any) {
      globalErrorVar(e.message);
    }
  };

  return noConnection ? (
    <ErrorDialog visible={noConnection}
                 hideDialog={handleReload}
                 message="Немає з'єднання з інтернетом"
                 buttonText='Перезавантажити'
    />
  ) : (
    <ImageBackground source={require('../../assets/images/bg.jpg')}
                     style={{width: '100%', height: Platform.OS !== Platforms.WEB ? '100%' : WINDOW_HEIGHT}}>
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
      {!loading && !error && !userLoading && !userError && userData && (
        <ClassroomsAppBar
          freeClassroomsAmount={freeClassroomsAmount}
          classrooms={data.classrooms}
          currentUser={userData.user}
          dispatcherActive={dispatcherActive}
        />
      )}

      <View style={styles.wrapper}>
        {crashMode && (
          <CrashModeAlert comment={crashModeComment} until={crashModeUntil}/>
        )}
        {showLog && (
          <Log data={JSON.stringify({...userData.user.queueInfo, ...userData.user.queue, ver: CURRENT_TEST_VERSION})}/>
        )}
        {!loading && !error && !userLoading && !userError && (
          <ScrollView style={styles.scrollView}
                      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
          >
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
            {!!data?.classrooms.filter(pending).length && (
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
            {!!data?.classrooms.filter(chosen).length && (
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
            <Space height={BOTTOM_SPACE}/>
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
      {!latestVersion?.[0] && Platform.OS !== Platforms.WEB && (
        <WarningDialog
          visible
          hideDialog={() => setLatestVersion([true, '', ''])}
          buttonText='Зрозуміло'
          message={`Доступна для завантеження версія додатку: ${latestVersion[2]}. Поточна версія: ${latestVersion[1]}. Будь ласка, завантажте оновлення з магазину!`}
        />
      )}
      {globalMessage && (
        <WarningDialog
          visible
          hideDialog={() => {
            setItem('lastGlobalMessage', globalMessage?.body);
            setGlobalMessage(null);
          }}
          buttonText='Більше не показувати'
          titleText={globalMessage?.title}
          message={globalMessage?.body}
        />
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create(
  {
    grid: {
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
      right: 60,
    },
    scrollView: {
      paddingTop: 8,
    },
  }
);
