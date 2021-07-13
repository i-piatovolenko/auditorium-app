import React, {useEffect, useRef, useState} from 'react';
import {ImageBackground, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import {ActivityIndicator, Appbar, Button, Divider} from "react-native-paper";
import useClassrooms from "../../hooks/useClassrooms";
import {ClassroomType, InstrumentType, Mode, User} from "../../models/models";
import ClassroomsCell from "../../components/ClassroomCell";
import Filters, {SpecialT} from "./Filters";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "../../types";
import ClassroomInfo from "../../components/ClassroomInfo";
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {getClassroomsFilteredByInstruments} from "./helpers";
import {useLocal} from "../../hooks/useLocal";
import {
  desirableClassroomIdsVar,
  isMinimalSetupVar,
  minimalClassroomIdsVar,
  modeVar
} from "../../api/client";
import getInLine from "../../helpers/queue/getInLine";
import InlineDialog from "../../components/InlineDialog";
import ConfirmLineOut from "../../components/ConfirmLineOut";
import {getItem} from "../../api/asyncStorage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

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
  const [visibleModalInline, setVisibleModalInline] = useState(false);
  const [visibleLineOut, setVisibleLineOut] = useState(false);
  const navigation = useNavigation();
  const [queueSize, setQueueSize] = useState(27);
  const [freeClassroomsAmount, setFreeClassroomsAmount] = useState(0);
  const [me, setMe] = useState<User | null>(null);
  const title = `Людей в черзі: ${queueSize}`;
  const inlineTitle = `Ви в черзі: ${queueSize}-й`;
  const {data: {mode}} = useLocal('mode');
  const {data: {isMinimalSetup}} = useLocal('isMinimalSetup');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // @ts-ignore
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    // @ts-ignore
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // @ts-ignore
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // @ts-ignore
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      // @ts-ignore
      Notifications.removeNotificationSubscription(notificationListener.current);
      // @ts-ignore
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
  async function sendPushNotification(clasroomId: number) {
    const classroomName = classrooms.find(({id}) => id === clasroomId)?.name;

    const message = {
      to: expoPushToken,
      sound: 'default',
      title: `Аудиторія ${classroomName} вільна!`,
      body: 'Підтвердіть або скасуйте',
      data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const getMe = () => getItem('user').then(user => setMe(user as unknown as User));

  useEffect(() => {
    getMe()
  }, []);

  useEffect(() => {
    classrooms && setFreeClassroomsAmount(classrooms?.filter(classroom => !classroom.occupied).length);
  }, [classrooms]);

  const showModalInline = () => setVisibleModalInline(true);

  const hideModalInline = () => setVisibleModalInline(false);

  const showModal = () => setVisible(true);

  const hideModal = () => setVisible(false);

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

  const handleReady = () => {
    getInLine(minimalClassroomIds, desirableClassroomIds);
    showModalInline();
  };

  const filterAwaitingFreeClassrooms = () => {
    let result;
    if (classrooms) {
      result = classrooms.filter(classroom => {
        if (!classroom.occupied) {
          sendPushNotification(classroom.id);
        }
        return !classroom.occupied
          // && classroom.queue[0] === me.id;
      });
    }

    return result;
  }

  useEffect(() => {
    classrooms && filterAwaitingFreeClassrooms();
  }, [classrooms.filter(({occupied}) => !occupied).length])

  return <ImageBackground source={require('../../assets/images/bg.jpg')}
                          style={{width: '100%', height: '100%'}}>
    <Appbar style={styles.top}>
      <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} color='#fff'/>
      {mode === Mode.PRIMARY && (
        <Appbar.Content style={{marginLeft: -10}} title={title} subtitle={'Вільних аудиторій: ' +
        freeClassroomsAmount} color='#fff'/>
      )}
      {mode === Mode.QUEUE_SETUP && (
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
      {mode === Mode.INLINE && (
        <Appbar.Content style={{marginLeft: -10}} title={inlineTitle} color='#fff'/>
      )}
    </Appbar>

    <View style={styles.wrapper}>
      {classrooms?.length ? <>
        <ScrollView>
          {(mode === Mode.PRIMARY || mode === Mode.QUEUE_SETUP || mode === Mode.OWNER) && (
            <View style={styles.grid}>
              {classrooms.map(classroom => <ClassroomsCell key={classroom.id} classroom={classroom}
                         filteredList={isMinimalSetup ? minimalClassroomIds : desirableClassroomIds}
              />)}
            </View>
          )}
          {mode === Mode.INLINE && (
            <>
              {!!freeClassroomsAmount && (
                <Text style={styles.gridDivider}>
                  Моя аудиторія:
                </Text>
              )}
              {!!freeClassroomsAmount && (
                <Text style={styles.gridDivider}>
                  Аудиторії, що очікують підтвердження:
                </Text>
              )}
              <View style={{...styles.grid, marginBottom: 10}}>
                {classrooms.filter(({id}) => minimalClassroomIds.includes(id))
                  .filter(({occupied}) => !occupied)
                  .map(classroom => <ClassroomsCell key={classroom.id} classroom={classroom}
                                                    filteredList={isMinimalSetup ? minimalClassroomIds : desirableClassroomIds}
                  />)}
              </View>
              <Text style={styles.gridDivider}>Аудиторії, за якими я стою в черзі: </Text>
              <View style={{...styles.grid, marginBottom: 10}}>
                {classrooms.filter(({id}) => minimalClassroomIds.includes(id))
                  .filter(({occupied}) => occupied)
                  .map(classroom => <ClassroomsCell key={classroom.id} classroom={classroom}
                                                    filteredList={isMinimalSetup ? minimalClassroomIds : desirableClassroomIds}
                  />)}
              </View>
              <Text style={styles.gridDivider}>Інші аудиторії: </Text>
              <View style={styles.grid}>
                {classrooms.filter(({id}) => !(minimalClassroomIds.includes(id)))
                  .map(classroom => <ClassroomsCell key={classroom.id} classroom={classroom}
                           filteredList={isMinimalSetup ? minimalClassroomIds : desirableClassroomIds}
                />)}
              </View>
            </>
          )}
        </ScrollView>
        {mode === Mode.PRIMARY && (
          <Button style={styles.getInLine} mode='contained' color='#2b5dff'
                  onPress={() => modeVar(Mode.QUEUE_SETUP)}>
            <Text>Стати в чергу ({queueSize + 1}-й)</Text>
          </Button>
        )}
        {mode === Mode.QUEUE_SETUP && (
          <>
            <Button style={styles.approve} mode='contained' color='#2b5dff'
                    onPress={handleReady}>
              <Text>Готово ({queueSize + 1}-й)</Text>
            </Button>
            <Button style={styles.getOutLine} mode='contained' color='#f91354'
                    onPress={() => modeVar(Mode.PRIMARY)}>
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
      <Filters hideModal={hideModal} visible={visible} apply={applyGeneralFilter} />
      <InlineDialog visible={visibleModalInline} hideDialog={hideModalInline} />
      <ConfirmLineOut hideDialog={hideConfirmLineOut} visible={visibleLineOut} />
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
      marginLeft: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
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
      bottom: 90,
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
      bottom: 90,
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
    gridDivider: {
      color: '#fff',
      marginBottom: 10,
      marginLeft: 3,
      marginRight: 3,
      paddingLeft: 17,
      fontSize: 18,
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff77',
      paddingBottom: 10
    }
  });