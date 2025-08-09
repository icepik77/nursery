import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Alert, Platform } from 'react-native';
import { auth } from "../firebaseConfig";

export async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Не удалось получить разрешение на уведомления!');
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log('Push token:', tokenData.data); // отправь на сервер
    return tokenData.data;
  } else {
    alert('Уведомления работают только на настоящем устройстве');
  }
}

export const requestNotificationPermission = async () => {
  let { status } = await Notifications.getPermissionsAsync();

  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    status = newStatus;
  }

  if (status !== 'granted') {
    Alert.alert('Нет доступа к уведомлениям');
    return false;
  }

  // Android: создаём канал, иначе уведомление не покажется
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
};

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);


// Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowBanner: true,
  //     shouldShowList: true,
  //     shouldPlaySound: false,
  //     shouldSetBadge: false,
  //   }),
  // });

  // // Second, call scheduleNotificationAsync()
  // Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: 'Look at that notification',
  //     body: "I'm so proud of myself!",
  //   },
  //   trigger: null,
  // });

  // useEffect(() => {
  //   const requestPermissions = async () => {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     if (status !== 'granted') {
  //       alert('Permission for notifications not granted');
  //     }
  //   };

  //   requestPermissions();
  // }, []);
