import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Agenda } from "react-native-calendars";
import { useFormContext } from "./context/formContext";

export default function CalendarScreen() {
  const [items, setItems] = useState({});
  const { animals } = useFormContext();

  useEffect(() => {
    const newItems = {};
    animals.forEach((animal) => {
      if (animal.birthdate) {
        if (!newItems[animal.birthdate]) newItems[animal.birthdate] = [];
        newItems[animal.birthdate].push({
          name: ` ${animal.name || "питомца"}`
        });
      }
    });
    setItems(newItems);
  }, [animals]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Agenda
        items={items}
        selected={Object.keys(items)[0] || new Date().toISOString().split("T")[0]}
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
  item: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: "#555",
  },
});
