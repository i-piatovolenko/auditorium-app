import React, {useState} from 'react';
import {Platform, StyleSheet, Text, View} from "react-native";
import {Button} from "react-native-paper";
import Colors from "../../constants/Colors";
import {hasOwnClassroom} from "../../helpers/helpers";
import {ClassroomType, Mode, SavedFilterT} from "../../models/models";
import {useLocal} from "../../hooks/useLocal";
import {client} from "../../api/client";
import {filterDisabledForQueue} from "../../helpers/filterDisabledForQueue";
import {getItem} from "../../api/asyncStorage";
import {filterSavedFilter} from "../../helpers/filterSavedFIlters";
import getInLine from "../../helpers/queue/getInLine";
import ErrorDialog from "../../components/ErrorDialog";
import moment from "moment";
import WaitDialog from "../../components/WaitDialog";
import ConfirmLineOut from "../../components/ConfirmLineOut";
import * as Location from 'expo-location';
import {getDistance} from "../../helpers/getDistance";
import {UNIVERSITY_LOCATION} from "../../constants/constants";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import {ADD_NOTIFICATION_TOKEN} from "../../api/operations/mutations/addNotificationToken";
import {
  desirableClassroomIdsVar, globalErrorVar,
  isMinimalSetupVar,
  minimalClassroomIdsVar,
  modeVar,
  pushNotificationTokenVar
} from "../../api/localClient";

type PropTypes = {
  currentUser: any;
  classrooms: ClassroomType[];
}

const Buttons: React.FC<PropTypes> = ({
                                        currentUser: {queueInfo: {sanctionedUntil}, ...currentUser},
                                        classrooms
                                      }) => {
  const {data: {mode}} = useLocal('mode');
  const {data: {maxDistance}} = useLocal('maxDistance');
  const {data: {desirableClassroomIds}} = useLocal('desirableClassroomIds');
  const {data: {minimalClassroomIds}} = useLocal('minimalClassroomIds');
  const [visibleModalError, setVisibleModalError] = useState(false);
  const queueErrorMessage = `Ви не можете ставати в чергу через накладені санкції до ${sanctionedUntil ? moment(sanctionedUntil)
    .format('DD-MM-YYYY HH:mm') : ''}. До закінчення санкційного терміну ви можете брати вільні аудиторії.`;
  const [loading, setLoading] = useState(false);
  const [visibleLineOut, setVisibleLineOut] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState<any>('');

  const requestLocation = async () => {
    setLoading(true);
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      setErrorMsg('Щоб взяти аудиторію або стати в чергу, потрібно надати дозвіл на геолокацію в налаштуваннях.');
    } else {
      setErrorMsg(null);
    }
  };

  const getIsNear = async () => {
    let isNear;
    await requestLocation();
    const location = await Location.getCurrentPositionAsync({});
    if (location) {
      const distance = getDistance(location.coords.latitude, location.coords.longitude,
        UNIVERSITY_LOCATION.lat, UNIVERSITY_LOCATION.long, 'K');
      if (distance <= maxDistance) {
        isNear = true;
      } else {
        isNear = false
        setErrorMsg(`Щоб взяти аудиторію або стати в чергу, Ви маєте знаходитись від академії на відстані, що не перебільшує ${maxDistance * 1000} м. Ваша відстань: ${
          (distance * 1000).toFixed(0)
        } м.`);
        setLoading(false);
      }
    } else {
      setErrorMsg('Щоб взяти аудиторію або стати в чергу, потрібно надати дозвіл на геолокацію в налаштуваннях.');
      setLoading(false);
    }
    return isNear;
  };

  const handlePress = async () => {
    setLoading(true);
    if (sanctionedUntil) return setVisibleModalError(true);
    if (mode === Mode.PRIMARY) {
      const availableClassroomsIds = classrooms.filter(classroom => {
        return filterDisabledForQueue(classroom, currentUser);
      }).map(({id}) => id);
      modeVar(Mode.QUEUE_SETUP);
      isMinimalSetupVar(true);
      const savedFilters: SavedFilterT[] | undefined = await getItem('filters');
      if (savedFilters) {
        const mainFilter = savedFilters!.find(filter => filter.main);
        if (mainFilter) {
          filterSavedFilter(mainFilter, classrooms, currentUser)
        } else {
          minimalClassroomIdsVar(availableClassroomsIds);
          desirableClassroomIdsVar([]);
        }
      } else {
        minimalClassroomIdsVar(availableClassroomsIds);
        desirableClassroomIdsVar([]);
      }
    }
    if (mode === Mode.QUEUE_SETUP) {
      modeVar(Mode.PRIMARY);
      minimalClassroomIdsVar([]);
      desirableClassroomIdsVar([]);
    }
    setLoading(false);
  };
  //
  // Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowAlert: true,
  //     shouldPlaySound: true,
  //     shouldSetBadge: false,
  //   }),
  // });

  async function registerForPushNotificationsAsync(setErrorText: (value: string) => void) {
    let token;
    if (Constants.isDevice) {
      const {status: existingStatus} = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const {status} = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        setErrorText('Щоб стати в чергу за аудиторіями, увімкніть будь-ласка сповіщення додатку для коректної роботи черги за аудиторіями')
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('auditorium', {
        name: 'auditorium',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const handleReady = async () => {
    let token;
    try {
      token = await registerForPushNotificationsAsync(setErrorMsg);
    } catch (e) {
      setErrorMsg('Щоб стати в чергу за аудиторіями, увімкніть будь-ласка сповіщення додатку для коректної роботи черги за аудиторіями');
      setLoading(false);
      return;
    }

    if (token) {
      setExpoPushToken(token);
      pushNotificationTokenVar(token);
      try {
        await client.mutate({
          mutation: ADD_NOTIFICATION_TOKEN,
          variables: {
            input: {
              notificationToken: token
            }
          }
        })
      } catch (e: any) {
        globalErrorVar(e.message);
        setLoading(false);
      }
    } else {
      setErrorMsg('Щоб стати в чергу за аудиторіями, увімкніть будь-ласка сповіщення додатку для коректної роботи черги за аудиторіями');
      setLoading(false);
      return;
    }
    const isNear = await getIsNear();
    if (isNear) {
      await getInLine(minimalClassroomIds, desirableClassroomIds);
      setLoading(false);
    }
    setLoading(false);
  };

  const hasAvailableClassroomsForQueue = () => {
    if (!classrooms.length) return false;
    return !!(classrooms.filter(classroom => {
      return filterDisabledForQueue(classroom, currentUser);
    }).length);
  }

  return (
    <View style={styles.wrapper}>
      {mode === Mode.PRIMARY
      && !(hasOwnClassroom(currentUser.occupiedClassrooms)) && (
        <Button
          style={styles.getInLine}
          mode='contained'
          color={Colors.blue}
          onPress={handlePress}
          loading={loading}
          disabled={loading || !hasAvailableClassroomsForQueue()}
        >
          <Text>Вибрати аудиторії для черги</Text>
        </Button>
      )}
      {mode === Mode.QUEUE_SETUP && (
        <>
          <Button
            style={styles.getOutLine}
            mode='contained'
            color={Colors.red}
            onPress={handlePress}
            loading={loading}
            disabled={loading}
          >
            <Text>Відміна</Text>
          </Button>
          <Button
            style={styles.approve}
            mode='contained'
            color={Colors.blue}
            disabled={(!minimalClassroomIds.length && !desirableClassroomIds.length)
            || loading || !hasAvailableClassroomsForQueue()}
            onPress={handleReady}
            loading={loading}
          >
            <Text>Стати в чергу</Text>
          </Button>
        </>
      )}
      {mode === Mode.INLINE && (
        <Button
          style={styles.getOutLine}
          mode='contained'
          color={Colors.red}
          onPress={() => setVisibleLineOut(true)}
          loading={loading}
          disabled={loading}
        >
          <Text>Вийти з черги</Text>
        </Button>
      )}
      <ErrorDialog
        visible={visibleModalError}
        hideDialog={() => setVisibleModalError(false)}
        message={queueErrorMessage}
      />
      <ErrorDialog
        visible={!!errorMsg}
        hideDialog={() => setErrorMsg(null)}
        message={errorMsg}
        buttonText='Зрозуміло'
      />
      <WaitDialog visible={loading}/>
      <ConfirmLineOut
        hideDialog={() => setVisibleLineOut(false)}
        visible={visibleLineOut}
      />
    </View>
  );
}

const styles = StyleSheet.create(
  {
    wrapper: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      right: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      zIndex: 1
    },

    getInLine: {
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    getOutLine: {
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    getOutLineSingle: {
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    approve: {
      width: '48%',
      height: 50,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }
);

export default Buttons;
