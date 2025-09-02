// app/events/[petId].tsx
import BottomMenu from "@/components/BottomMenu";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePetContext } from "../context/formContext";

export default function EventListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { fetchEvents, addEvent, updateEvent, deleteEvent, pets, allEvents, selectedPetId } = usePetContext();

  useEffect(() => {
    if (selectedPetId) {
      console.log("selectedPetId", selectedPetId); 
      fetchEvents(selectedPetId);
    }
  }, [selectedPetId]);

  const pet = pets.find((p) => p.id === id);
  const selectedPetEvents = allEvents[id ?? ""] || [];

  if (!pet) return <Text>Питомец не найден</Text>;

  const handleSave = () => {
    if (!title || !date) return;

    if (editingIndex !== null) {
      updateEvent(pet.id, editingIndex, { title, date });
      setEditingIndex(null);
    } else {
      addEvent(pet.id, { title, date });
    }

    setTitle("");
    setDate("");
  };

  const startEdit = (index: number) => {
    const event = selectedPetEvents[index];
    setTitle(event.title);
    setDate(event.date);
    setEditingIndex(index);
  };

  const confirmDelete = (index: number) => {
    Alert.alert("Удалить событие", "Вы уверены?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => deleteEvent(pet.id, index),
      },
    ]);
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>События: {pet.name}</Text>

          <FlatList
            data={selectedPetEvents}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDate}>{item.date}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => startEdit(index)}>
                    <Ionicons name="pencil" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDelete(index)}>
                    <Ionicons name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* Форма */}
          <View style={styles.form}>
            <TextInput
              placeholder="Название события"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={18} color="#4A90E2" />
              <Text style={styles.dateButtonText}>
                {date ? date : "Выбрать дату"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date ? new Date(date) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {editingIndex !== null ? "Сохранить изменения" : "Добавить событие"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <BottomMenu/>
    </>
     
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16, marginTop: 30 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, marginTop: 16, },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardDate: { color: "#555" },
  actions: { flexDirection: "row", alignItems: "center", gap: 12 },
  form: { marginTop: 20, marginBottom: 80 },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateButtonText: { marginLeft: 8, color: "#4A90E2" },
  saveButton: {
    backgroundColor: "#00796b",
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
