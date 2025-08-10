// app/events/[petId].tsx
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { usePetContext } from "../context/formContext";



export default function EventListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    addEvent,
    updateEvent,
    deleteEvent,
    pets,
    allEvents,
  } = usePetContext();

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

  return (
    <View style={{ padding: 16, marginTop: 30}}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        События: {pet.name}
      </Text>

      <FlatList
        data={selectedPetEvents}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              paddingVertical: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>{item.title} - {item.date}</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={() => startEdit(index)}>
                <Text style={{ color: "blue" }}>Изменить</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(index)}>
                <Text style={{ color: "red" }}>Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TextInput
        placeholder="Название"
        value={title}
        onChangeText={setTitle}
        style={{
          marginTop: 20,
          backgroundColor: "#eee",
          padding: 10,
          borderRadius: 8,
        }}
      />
      <TextInput
        placeholder="Дата (ГГГГ-ММ-ДД)"
        value={date}
        onChangeText={setDate}
        style={{
          marginTop: 10,
          backgroundColor: "#eee",
          padding: 10,
          borderRadius: 8,
        }}
      />
      <TouchableOpacity
        onPress={handleSave}
        style={{
          backgroundColor: "#041029",
          padding: 12,
          borderRadius: 8,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          {editingIndex !== null ? "Сохранить изменения" : "Добавить событие"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
