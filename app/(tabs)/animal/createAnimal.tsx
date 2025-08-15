import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns"; // 💡 Для форматирования даты
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { usePetContext } from "../context/formContext";

const TABS = ["Медицина", "Документы", "Заметки", "Напоминания"];

export default function MainScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { selectedPetId, addEvent, formData, setFormData, addPet } = usePetContext();
  const router = useRouter(); 

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const pickedUri = result.assets[0].uri;

      const fileName = pickedUri.split("/").pop();
      const dir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? "";
      const newPath = dir + fileName;

      await FileSystem.copyAsync({
        from: pickedUri,
        to: newPath,
      });

      // 💡 Обновляем локальное состояние
      setImageUri(newPath);

      // 💡 И сохраняем в formData
      setFormData({
        ...formData,
        imageUri: newPath,
      });
    };
  };

  const handleSubmit = () => {
    addPet(); // or await addPet() if it's async
    router.replace("/"); // or router.push("/") if you want to stack it
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Создать профиль</Text>

      <View style={styles.card}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => {
                if (tab === "Календарь") {
                  router.push("/calendar");
                } else {
                    if (tab === "Документы") {
                    router.push(`/animal/${selectedPetId}/documents`);
                  }
                }
              }}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main content */}
        <View style={styles.contentWrapper}>
          {/* Left side: photo + button */}
          <View style={styles.leftBlock}>
            <TouchableOpacity onPress={pickImage}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.imagePlaceholder}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageText}>Фото питомца</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.publishButton} onPress={handleSubmit}>
              <Text style={styles.publishButtonText}>Опубликовать</Text>
            </TouchableOpacity>
          </View>

          {/* Right side: inputs */}
          <View style={styles.rightBlock}>
            {[
              ["Кличка", "name"],
              ["Пол", "gender"],
              ["Дата рождения", "birthdate"],
              ["Номер чипа", "chip"],
              ["Порода", "breed"],
              ["Вес", "weight"],
              ["Рост в холке", "height"],
              ["Окрас", "color"],
              ["Примечание", "note"],
            ].map(([label, name]) => (
              <View key={name} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>

                {name === "birthdate" ? (
                  <>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={[styles.input, { justifyContent: "center" }]}
                    >
                      <Text>
                        {formData.birthdate
                          ? format(new Date(formData.birthdate), "yyyy-MM-dd")
                          : "Выберите дату"}
                      </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={
                          formData.birthdate
                            ? new Date(formData.birthdate)
                            : new Date()
                        }
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setFormData((prev) => ({
                              ...prev,
                              birthdate: format(selectedDate, "yyyy-MM-dd"),
                            }));
                          }
                        }}
                      />
                    )}
                  </>
                ) : (
                  <TextInput
                    style={styles.input}
                    value={formData[name as keyof typeof formData]}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, [name]: text }))
                    }
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );

}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    marginTop:10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // расстояние между табами
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 12,
    marginBottom: 16,
    justifyContent: 'center'
  },
  tabButton: {
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    color: "#4B5563",
  },
  contentWrapper: {
    flexDirection: screenWidth > 768 ? "row" : "column",
    gap: 16,
  },
  leftBlock: {
    flex: 1,
    alignItems: "center",
    gap: 16,
  },
  imagePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: "#D1D5DB",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    color: "#6B7280",
  },
  publishButton: {
    backgroundColor: "#00796b",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  publishButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  rightBlock: {
    flex: 1,
    gap: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  eventSection: {
  marginTop: 24,
  paddingTop: 16,
  borderTopWidth: 1,
  borderTopColor: "#E5E7EB",
  gap: 12,
},
});
