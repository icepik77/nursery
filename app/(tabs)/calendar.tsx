import BottomMenu from "@/components/BottomMenu";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Agenda, AgendaEntry } from "react-native-calendars";
import { usePetContext } from "./context/formContext";

type CalendarItems = {
  [date: string]: AgendaEntry[];
};

export default function CalendarScreen() {
  const [items, setItems] = useState<CalendarItems>({});
  const { pets, allEvents } = usePetContext();


  useEffect(() => {
    const newItems: CalendarItems = {};

    // Добавляем дни рождения всех питомцев
    pets.forEach((pet) => {
      const birthdate = pet.birthdate?.split("T")[0]; // на случай ISO строки
      if (birthdate) {
        if (!newItems[birthdate]) newItems[birthdate] = [];
        newItems[birthdate].push({
          name: `🎂 День рождения: ${pet.name || "Питомец"}`,
          height: 50,
        });
      }
    });

    // Добавляем события всех питомцев в календарь 
    Object.entries(allEvents).forEach(([petId, petEvents]) => {
      const pet = pets.find(p => p.id === petId);
      if (!pet) return;
      
      petEvents.forEach((event) => {
        const date = event.date?.split("T")[0];
        if (date) {
          if (!newItems[date]) newItems[date] = [];
          newItems[date].push({
            name: `📌 ${event.title} (${pet.name})`,
            height: 50,
          });
        }
      });
    });

    setItems(newItems);
  }, [pets, allEvents]);

  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        items={items}
        selected={new Date().toISOString().split("T")[0]}
        renderItem={(item) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        )}
        renderEmptyDate={() => (
          <View style={styles.emptyDate}>
            <Text style={styles.emptyDateText}>Нет событий</Text>
          </View>
        )}
        theme={{
          agendaTodayColor: "#041029",
          selectedDayBackgroundColor: "#041029",
          dotColor: "#041029",
          todayTextColor: "#041029",
        }}
      />
      <BottomMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: "#111827",
  },
  emptyDate: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 16,
  },
  emptyDateText: {
    fontSize: 14,
    color: "#6B7280",
  },
});


