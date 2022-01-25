import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, {useState, useEffect, useRef} from 'react';
import {Platform} from 'react-native';
import WarningDialog from "../components/WarningDialog";
import {pushNotificationTokenVar} from "../api/localClient";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type PropTypes = {
  setPushNotificationToken: (token: string) => void;
}

export default function PushNotification({setPushNotificationToken}: PropTypes) {
  const [expoPushToken, setExpoPushToken] = useState<any>('');
  const [notification, setNotification] = useState<any>(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync(setErrorText).then(token => {
      setPushNotificationToken(token);
      setExpoPushToken(token);
      pushNotificationTokenVar(token);
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <WarningDialog visible={!!errorText} hideDialog={() => setErrorText(null)} message={errorText} />
  )};

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
export async function sendPushNotification(expoPushToken: string, title: string, body: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: {someData: 'goes here'},
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
      setErrorText('Рекомендуємо увімкнути сповіщення додатку для коректної роботи черги за аудиторіями')
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('auditorium', {
      name: 'auditorium',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
