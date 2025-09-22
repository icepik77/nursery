import BottomMenu from "@/components/BottomMenu";
import CustomHeader from "@/components/CustomHeader";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // ✅ добавили Picker
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { usePetContext } from "../context/formContext";

const TABS = ["Медицина", "Документы", "Заметки", "График"];

export default function MainScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { selectedPetId, formData, setFormData, addPet } = usePetContext();
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const pickedUri = result.assets[0].uri;

      // Сохраняем только uri — он же нужен для отображения
      setImageUri(pickedUri);
      setFormData({
        ...formData,
        imageUri: pickedUri,
      });
    }
  };

  const handleSubmit = () => {
    addPet();
    router.replace("/");
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <CustomHeader title="Создание животных"/>
          <ScrollView contentContainerStyle={styles.container}>
            
            <View style={styles.card}>
              {/* Tabs */}
              <View style={styles.tabsContainer}>
                {TABS.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={styles.tabButton}
                    onPress={() => {
                      if (tab ==="График"){
                        router.push({
                          pathname: "../events/[id]",
                          params: { id: selectedPetId}
                        });
                      }
                      if (tab === "Документы") {
                        router.push(`/animal/${selectedPetId}/documents`);
                      }
                      if (tab === "Медицина") {
                        router.push(`/animal/${selectedPetId}/medical`);
                      }
                      if (tab === "Заметки") {
                        router.push(`/animal/${selectedPetId}/note`);
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
                  {/* ✅ Новый селектор категории */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Категория</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={formData.category || ""}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <Picker.Item label="Выберите категорию" value="" />
                        <Picker.Item label="домашние питомцы" value="домашние питомцы" />
                        <Picker.Item label="крупные животные" value="крупные животные" />
                        <Picker.Item label="птицы" value="птицы" />
                        <Picker.Item label="мелкие животные" value="мелкие животные" />
                      </Picker>
                    </View>
                  </View>

                  {/* Остальные поля */}
                  {[
  { label: "Кличка", name: "name" },
  { label: "Кличка по паспорту", name: "pasportName" }, // Новый инпут
  {
    label: "Пол",
    name: "gender",
    customInput: (
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.gender || ""}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, gender: value }))
          }
        >
          <Picker.Item label="Выберите пол" value="" />
          <Picker.Item label="Мужской" value="мужской" />
          <Picker.Item label="Женский" value="женский" />
        </Picker>
      </View>
    ),
  },
  {
    label: "Дата рождения",
    name: "birthdate",
    customInput: (
      <View>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>
            {formData.birthdate
              ? new Date(formData.birthdate).toLocaleDateString()
              : "Выберите дату"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={
              formData.birthdate ? new Date(formData.birthdate) : new Date()
            }
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === "ios"); // скрывать на Android
              if (selectedDate) {
                setFormData((prev) => ({
                  ...prev,
                  birthdate: selectedDate.toISOString(),
                }));
              }
            }}
          />
        )}
      </View>
    ),
  },
  {
    label: "Номер чипа",
    name: "chip",
  },
  {
    label: "Порода",
    name: "breed",
  },
  {
    label: "Вес",
    name: "weight",
  },
  {
    label: "Рост в холке",
    name: "height",
  },
  {
    label: "Окрас",
    name: "color",
  },
  {
    label: "Примечание",
    name: "note",
  },
].map(({ label, name, customInput }) => (
  <View key={name} style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    {customInput ? (
      customInput
    ) : (
      <TextInput
        style={styles.input}
        value={formData[name as keyof typeof formData] || ""}
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
        </SafeAreaView>
      </KeyboardAvoidingView>
      <View style={styles.bottomMenuWrapper}>
        <BottomMenu />
      </View>
    </>
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
    marginTop: 16,
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
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 12,
    marginBottom: 16,
    justifyContent: "center",
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
  bottomMenuWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
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
    marginBottom: 60,
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
  pickerWrapper: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
});
