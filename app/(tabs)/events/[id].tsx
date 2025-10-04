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

  // Менструальные циклы (только начало!)
  const [cycleStart, setCycleStart] = useState("");
  const [editingCycleIndex, setEditingCycleIndex] = useState<number | null>(null);
  const [showCycleStartPicker, setShowCycleStartPicker] = useState(false);

  const {
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    pets,
    allEvents,
    selectedPetId,
    cycles,
    fetchCycles,
    addCycle,
    updateCycle,
    deleteCycle,
  } = usePetContext();

  useEffect(() => {
    if (selectedPetId) {
      fetchEvents(selectedPetId);
      fetchCycles(selectedPetId);
    }
  }, [selectedPetId]);

  const pet = pets.find((p) => p.id === id);
  const selectedPetEvents = allEvents[id ?? ""] || [];
  const selectedPetCycles = cycles[id ?? ""] || [];

  if (!pet) return <Text>Питомец не найден</Text>;

  // ---- Events ----
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

  // ---- Cycles ----
  const handleSaveCycle = () => {
    if (!cycleStart) return;
    const newCycle = { start: cycleStart };

    if (editingCycleIndex !== null) {
      updateCycle(pet.id, editingCycleIndex, newCycle);
      setEditingCycleIndex(null);
    } else {
      addCycle(pet.id, newCycle);
    }

    setCycleStart("");
  };

  const startEditCycle = (index: number) => {
    const cycle = selectedPetCycles[index];
    setCycleStart(cycle.start);
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
    if (!selectedDate) return;

    const picked = selectedDate.toISOString().split("T")[0];
    setCycleStart(picked);

    const newCycle = { start: picked };

    if (editingCycleIndex !== null) {
      updateCycle(pet.id, editingCycleIndex, newCycle);
      setEditingCycleIndex(null);
    } else {
      addCycle(pet.id, newCycle);
    }
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
      { text: "Удалить", style: "destructive", onPress: () => deleteEvent(pet.id, index) },
    ]);
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate.toISOString().split("T")[0]);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          <CustomHeader title="События и циклы" />

          {/* ================= Cycles (ВВЕРХУ) ================= */}
          <Text style={styles.title}>Менструальные цикл</Text>
          <FlatList
            data={selectedPetCycles}
            keyExtractor={(_, index) => `cycle-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.start}</Text>
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

          {/* Form for cycles */}
         {/* ================= Cycles (ONLY DATEPICKER) ================= */}
          <Text style={styles.title}>Менструальный цикл</Text>
          <View style={styles.form}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowCycleStartPicker(true)}
            >
              <Ionicons name="calendar" size={18} color="#4A90E2" />
              <Text style={styles.dateButtonText}>
                {cycleStart || "Выбрать дату начала"}
              </Text>
            </TouchableOpacity>

            {showCycleStartPicker && (
              <DateTimePicker
                value={cycleStart ? new Date(cycleStart) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onCycleStartChange}  // 👈 сразу добавляет цикл
              />
            )}
          </View>

          {/* ================= Events (НИЖЕ) ================= */}
          <Text style={styles.title}>События</Text>
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

          {/* Form for events */}
          <View style={styles.form}>
            <TextInput
              placeholder="Название события"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar" size={18} color="#4A90E2" />
              <Text style={styles.dateButtonText}>{date || "Выбрать дату"}</Text>
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
      <BottomMenu />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8", padding: 16, paddingBottom: 70 },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 12 },
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
  form: { marginTop: 10, marginBottom: 30 },
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
