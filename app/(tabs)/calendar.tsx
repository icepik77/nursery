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
  const [markedDates, setMarkedDates] = useState<any>({});
  const [loaded, setLoaded] = useState(false);
  const { pets, allEvents, cycles } = usePetContext();

  useEffect(() => {
    const newItems: CalendarItems = {};
    const newMarks: any = {};

    // 🎂 Дни рождения
    pets.forEach((pet) => {
      const birthdate = pet.birthdate?.split("T")[0];
      if (birthdate) {
        if (!newItems[birthdate]) newItems[birthdate] = [];
        newItems[birthdate].push({
          name: `🎂 День рождения: ${pet.name || "Питомец"}`,
          height: 50,
        });

        newMarks[birthdate] = { marked: true, dotColor: "#00796b" }; // зелёная точка
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

          newMarks[date] = { marked: true, dotColor: "#00796b" };
        }
      });
    });

    // 🔴 Менструальные циклы
    Object.entries(cycles).forEach(([petId, petCycles]) => {
      const pet = pets.find((p) => p.id === petId);
      if (!pet) return;

      petCycles.forEach((cycle) => {
        if (!cycle.start) return;

        const firstStart = new Date(cycle.start);
        const duration = cycle.end 
          ? (new Date(cycle.end).getTime() - firstStart.getTime()) / (1000 * 60 * 60 * 24) 
          : 7; // default 7 days if no end

        // 👉 generate cycles for next 2 years (can adjust)
        for (let i = 0; i < 4; i++) { 
          const start = new Date(firstStart);
          start.setMonth(start.getMonth() + i * 6); // every 6 months
          const end = new Date(start);
          end.setDate(start.getDate() + duration);

          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split("T")[0];
            if (!newItems[dateStr]) newItems[dateStr] = [];
            newItems[dateStr].push({
              name: `🔴 Цикл (${pet.name})${cycle.note ? " – " + cycle.note : ""}`,
              height: 50,
            });

            newMarks[dateStr] = { marked: true, dotColor: "red" };
          }
        }
      });
    });

    setItems(newItems);
    setMarkedDates(newMarks);
    setLoaded(true);
  }, [pets, allEvents, cycles]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Календарь"/>
      <Agenda
        items={items}
        markedDates={markedDates}
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
        renderEmptyData={() => (     // 👈 это решает проблему "крутилки"
          <View style={styles.emptyDate}>
            <Text style={styles.emptyDateText}>Нет событий</Text>
          </View>
        )}
        refreshing={false}            // 👈 выключили спиннер
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
  container: { flex: 1 },
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
  itemText: { fontSize: 16, color: "#111827" },
  emptyDate: { flex: 1, paddingTop: 20, paddingLeft: 16 },
  emptyDateText: { fontSize: 14, color: "#6B7280" },
});
