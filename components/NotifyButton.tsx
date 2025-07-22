import * as Notifications from 'expo-notifications';
import React from 'react';
import { Alert, Button } from 'react-native';

type NotifyButtonProps = {
  title?: string;
  message?: string;
  delay?: number; // задержка в секундах
};

export const NotifyButton: React.FC<NotifyButtonProps> = ({
  title = 'Запустить уведомление',
  message = 'Это уведомление',
  delay = 5,
}) => {
  const handlePress = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Нет разрешения на уведомления');
        return;
      }
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Напоминание!',
        body: message,
      },
      trigger: { seconds: delay },
    });

    Alert.alert('Уведомление будет через ' + delay + ' секунд');
  };

  return <Button title={title} onPress={handlePress} />;
};
