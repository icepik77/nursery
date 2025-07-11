import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

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
