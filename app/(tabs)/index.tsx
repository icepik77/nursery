import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Agenda } from 'react-native-calendars';
 

export default function Index() {
  const [items, setItems] = useState({});
  const [date, setDate] = useState('');
  const [eventName, setEventName] = useState('');

  // Notifications.setNotificationHandler({
  //   handleNotification: async () => ({
  //     shouldShowAlert: true,
  //     shouldPlaySound: false,
  //     shouldSetBadge: false
  //   })
  // });

  // useEffect(() => {
  //   registerForPushNotificationsAsync();

  //   const subscription = Notifications.addNotificationReceivedListener(notification => {
  //     console.log('Уведомление:', notification);
  //   });

  //   return () => subscription.remove();
  // }, []);


  const addEvent = () => {
    if (!date || !eventName) return;

    setItems(prevItems => {
      const dayItems = prevItems[date] || [];
      return {
        ...prevItems,
        [date]: [...dayItems, { name: eventName }]
      };
    });

    //очистка полей
    setDate('');
    setEventName('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.form}>
        <TextInput
          placeholder="Дата (YYYY-MM-DD)"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          placeholder="Название события"
          style={styles.input}
          value={eventName}
          onChangeText={setEventName}
        />
        <TouchableOpacity style={styles.button} onPress={addEvent}>
          <Text style={styles.buttonText}>Добавить</Text>
        </TouchableOpacity>
      </View>

      <Agenda
        items={items}
        selected={Object.keys(items)[0]}
        renderItem={(item) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 10,
    backgroundColor: '#f4f4f4'
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#3366ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 17
  },
  itemText: {
    color: '#555'
  }
});

