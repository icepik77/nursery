import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFormContext } from "./context/formContext";

const fields = [
  ["Кличка", "name"],
  ["Дата рождения", "birthdate"],
];

export default function AddAnimalScreen() {
  const { formData, setFormData, addAnimal } = useFormContext();
  const [activeTab, setActiveTab] = useState("Профиль");

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Добавление животного</Text>

      <View style={styles.card}>
        <View style={styles.tabs}>
          <Text style={[styles.tabText, styles.activeTab]}>{activeTab}</Text>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.leftSide}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Фото питомца</Text>
            </View>
            <TouchableOpacity style={styles.publishButton} onPress={addAnimal}>
              <Text style={styles.publishButtonText}>Опубликовать</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightSide}>
            {fields.map(([label, name]) => (
              <View key={name} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={formData[name as keyof typeof formData] || ""}
                  onChangeText={(text) => handleChange(name, text)}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#F9FAFB" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 16, alignSelf: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4B5563",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    paddingBottom: 4,
    marginRight: 12,
  },
  activeTab: {
    color: "#2563EB",
    borderBottomColor: "#2563EB",
  },
  contentWrapper: {
    flexDirection: Dimensions.get("window").width > 768 ? "row" : "column",
    gap: 16,
  },
  leftSide: { flex: 1, alignItems: "center", gap: 16 },
  imagePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: { color: "#6B7280" },
  publishButton: {
    backgroundColor: "#041029",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  publishButtonText: { color: "#fff", fontWeight: "bold" },
  rightSide: { flex: 1 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
