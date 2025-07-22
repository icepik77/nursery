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
  const { pets, selectedPetEvents } = usePetContext();

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

    // Добавляем события текущего выбранного питомца
    selectedPetEvents.forEach((event) => {
      const date = event.date?.split("T")[0];
      if (date) {
        if (!newItems[date]) newItems[date] = [];
        newItems[date].push({
          name: `📌 ${event.title}`,
          height: 50,
        });
      }
    });

    setItems(newItems);
  }, [pets, selectedPetEvents]);

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






// import { use, useEffect, useState } from "react";
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View
// } from "react-native";
// import { Agenda } from "react-native-calendars";
// import { usePetContext } from "./context/formContext";

// export default function CalendarScreen() {
//   const [items, setItems] = useState({});
//   const { animals, events } = usePetContext();

// useEffect(() => {
//   const newItems = {};

//   // События от животных
//   animals.forEach((animal) => {
//     if (animal.birthdate) {
//       if (!newItems[animal.birthdate]) newItems[animal.birthdate] = [];
//       newItems[animal.birthdate].push({
//         name: `День рождения ${animal.name || "питомца"}`
//       });
//     }
//   });

//   // Пользовательские события
//   events.forEach((event) => {
//     if (!newItems[event.date]) newItems[event.date] = [];
//     newItems[event.date].push({ name: event.title });
//   });

//   setItems(newItems);
// }, [animals, events]);

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <Agenda
//         items={items}
//         selected={Object.keys(items)[0] || new Date().toISOString().split("T")[0]}
//         renderItem={(item) => (
//           <View style={styles.item}>
//             <Text style={styles.itemText}>{item.name}</Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   item: {
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 5,
//     marginRight: 10,
//     marginTop: 17,
//   },
//   itemText: {
//     color: "#555",
//   },
// });
