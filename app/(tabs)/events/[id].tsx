// app/events/[petId].tsx
import BottomMenu from "@/components/BottomMenu";
import CustomHeader from "@/components/CustomHeader";
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

  // Menstrual cycles state
  const [cycleStart, setCycleStart] = useState("");
  const [cycleEnd, setCycleEnd] = useState("");
  const [cycleNote, setCycleNote] = useState("");
  const [editingCycleIndex, setEditingCycleIndex] = useState<number | null>(null);
  const [showCycleStartPicker, setShowCycleStartPicker] = useState(false);
  const [showCycleEndPicker, setShowCycleEndPicker] = useState(false);

  const { fetchEvents, addEvent, updateEvent, deleteEvent, pets, allEvents, selectedPetId, cycles, fetchCycles, addCycle, updateCycle, deleteCycle } = usePetContext();

  useEffect(() => {
    if (selectedPetId) {
      fetchEvents(selectedPetId);
      fetchCycles(selectedPetId); // fetch cycles for this pet
    }
  }, [selectedPetId]);

  const pet = pets.find((p) => p.id === id);
  const selectedPetEvents = allEvents[id ?? ""] || [];
  const selectedPetCycles = cycles[id ?? ""] || [];

  if (!pet) return <Text>Питомец не найден</Text>;

  // Event handlers (existing)
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

  // Cycle handlers
  const handleSaveCycle = () => {
    if (!cycleStart) return;

    const newCycle = { start: cycleStart, end: cycleEnd || undefined, note: cycleNote || undefined };

    if (editingCycleIndex !== null) {
      updateCycle(pet.id, editingCycleIndex, newCycle);
      setEditingCycleIndex(null);
    } else {
      addCycle(pet.id, newCycle);
    }

    setCycleStart("");
    setCycleEnd("");
    setCycleNote("");
  };

  const startEditCycle = (index: number) => {
    const cycle = selectedPetCycles[index];
    setCycleStart(cycle.start);
    setCycleEnd(cycle.end || "");
    setCycleNote(cycle.note || "");
    setEditingCycleIndex(index);
  };

  const confirmDeleteCycle = (index: number) => {
    Alert.alert("Удалить цикл", "Вы уверены?", [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: () => deleteCycle(pet.id, index) },
    ]);
  };

  const onCycleStartChange = (_: any, selectedDate?: Date) => {
    setShowCycleStartPicker(false);
    if (selectedDate) setCycleStart(selectedDate.toISOString().split("T")[0]);
  };

  const onCycleEndChange = (_: any, selectedDate?: Date) => {
    setShowCycleEndPicker(false);
    if (selectedDate) setCycleEnd(selectedDate.toISOString().split("T")[0]);
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
    if (selectedDate) setDate(selectedDate.toISOString().split("T")[0]);
  };

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <SafeAreaView style={styles.container}>
          <CustomHeader title="События и циклы" />

          {/* ================= Events ================= */}
          <FlatList
            data={selectedPetEvents}
            keyExtractor={(_, index) => `event-${index}`}
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

          {/* ================= Events Form ================= */}
          <View style={styles.form}>
            <TextInput placeholder="Название события" value={title} onChangeText={setTitle} style={styles.input} />
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={18} color="#4A90E2" />
              <Text style={styles.dateButtonText}>{date || "Выбрать дату"}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={date ? new Date(date) : new Date()} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onDateChange} />}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{editingIndex !== null ? "Сохранить изменения" : "Добавить событие"}</Text>
            </TouchableOpacity>
          </View>

          {/* ================= Cycles ================= */}
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>Менструальные циклы</Text>
          <FlatList
            data={selectedPetCycles}
            keyExtractor={(_, index) => `cycle-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <View>
                  <Text style={styles.cardTitle}>{item.start} → {item.end || "?"}</Text>
                  {item.note && <Text style={styles.cardDate}>{item.note}</Text>}
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => startEditCycle(index)}>
                    <Ionicons name="pencil" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmDeleteCycle(index)}>
                    <Ionicons name="trash" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* ================= Cycles Form ================= */}
          <View style={styles.form}>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowCycleStartPicker(true)}>
              <Ionicons name="calendar" size={18} color="#4A90E2" />
              <Text style={styles.dateButtonText}>{cycleStart || "Начало цикла"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowCycleEndPicker(true)}>
              <Ionicons name="calendar" size={18} color="#4A90E2" />
              <Text style={styles.dateButtonText}>{cycleEnd || "Конец цикла (опционально)"}</Text>
            </TouchableOpacity>
            <TextInput placeholder="Комментарий" value={cycleNote} onChangeText={setCycleNote} style={styles.input} />

            {showCycleStartPicker && <DateTimePicker value={cycleStart ? new Date(cycleStart) : new Date()} mode="date" display="default" onChange={onCycleStartChange} />}
            {showCycleEndPicker && <DateTimePicker value={cycleEnd ? new Date(cycleEnd) : new Date()} mode="date" display="default" onChange={onCycleEndChange} />}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCycle}>
              <Text style={styles.saveButtonText}>{editingCycleIndex !== null ? "Сохранить цикл" : "Добавить цикл"}</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </KeyboardAvoidingView>
      <BottomMenu />
    </>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8", padding: 16, marginTop: 0 },
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
