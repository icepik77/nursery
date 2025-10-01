import BottomMenu from "@/components/BottomMenu";
import CustomHeader from "@/components/CustomHeader";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AgendaEntry, Calendar } from "react-native-calendars";
import { usePetContext } from "./context/formContext";

type CalendarItems = {
  [date: string]: AgendaEntry[];
};

export default function CalendarScreen() {
  const [items, setItems] = useState<CalendarItems>({});
  const [loaded, setLoaded] = useState(false); // флаг загрузки
  const { pets, allEvents, cycles } = usePetContext();

  const [markedDates, setMarkedDates] = useState({});

useEffect(() => {
  const marks: any = {};

  Object.entries(cycles).forEach(([petId, petCycles]) => {
    const pet = pets.find((p) => p.id === petId);
    if (!pet) return;

    petCycles.forEach((cycle) => {
      if (!cycle.start) return;

      const start = new Date(cycle.start);
      const end = cycle.end ? new Date(cycle.end) : start;

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];

        marks[dateStr] = {
          ...(marks[dateStr] || {}),
          color: "#f48fb1",
          textColor: "white",
        };

        if (dateStr === cycle.start) {
          marks[dateStr].startingDay = true;
        }
        if (dateStr === cycle.end) {
          marks[dateStr].endingDay = true;
        }
      }
    });
  });

  setMarkedDates(marks);
}, [cycles, pets]);

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
      <Calendar
        items={items}
        markingType="period"
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
        renderEmptyData={() => (         // 👈 добавляем это
          <View style={styles.emptyDate}>
            <Text style={styles.emptyDateText}>Событий пока нет</Text>
          </View>
        )}
        refreshing={!loaded}             // 👈 чтобы скрыть колесо после загрузки
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


