import BottomMenu from "@/components/BottomMenu";
import CustomHeader from "@/components/CustomHeader";
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
  const [loaded, setLoaded] = useState(false); // флаг загрузки
  const { pets, allEvents, cycles } = usePetContext();

  useEffect(() => {
    const newItems: CalendarItems = {};

    // 🎂 Дни рождения
    pets.forEach((pet) => {
      const birthdate = pet.birthdate?.split("T")[0];
      if (birthdate) {
        if (!newItems[birthdate]) newItems[birthdate] = [];
        newItems[birthdate].push({
          name: `🎂 День рождения: ${pet.name || "Питомец"}`,
          height: 50,
        });
      }
    });

    // 📅 Обычные события
    Object.entries(allEvents).forEach(([petId, petEvents]) => {
      const pet = pets.find((p) => p.id === petId);
      if (!pet) return;

      petEvents.forEach((event) => {
        const date = event.date?.split("T")[0];
        if (date) {
          if (!newItems[date]) newItems[date] = [];
          newItems[date].push({
            name: `${event.title} (${pet.name})`,
            height: 50,
          });
        }
      });
    });

    // 🔴 Менструальные циклы
    Object.entries(cycles).forEach(([petId, petCycles]) => {
      const pet = pets.find((p) => p.id === petId);
      if (!pet) return;

      petCycles.forEach((cycle) => {
        if (!cycle.start) return;

        const start = new Date(cycle.start);
        const end = cycle.end ? new Date(cycle.end) : start;

        // идём по дням от start до end
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split("T")[0];
          if (!newItems[dateStr]) newItems[dateStr] = [];
          newItems[dateStr].push({
            name: `🔴 Цикл (${pet.name})${cycle.note ? " – " + cycle.note : ""}`,
            height: 50,
          });
        }
      });
    });

  setItems(newItems);
  setLoaded(true);
}, [pets, allEvents, cycles]);

  // if (loaded && Object.keys(items).length === 0) {
  //   // если загрузка завершена и нет событий
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //         <Text style={{ color: "#6B7280", fontSize: 16 }}>Нет мероприятий</Text>
  //       </View>
  //       <BottomMenu />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Календарь"/>
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
          agendaTodayColor: "#00796b",
          selectedDayBackgroundColor: "#00796b",
          dotColor: "#00796b",
          todayTextColor: "#00796b",
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


