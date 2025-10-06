import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  View,
} from "react-native";


import BottomMenu from "@/components/BottomMenu";
import CustomHeader from "@/components/CustomHeader";
import { usePetContext } from "../context/formContext";


//Это страница редактирования
// const TABS = ["Профиль", "Вет. паспорт", "Документы", "События", "Заметки", "Календарь"];
const TABS = ["Медицина", "Документы", "Заметки", "График"];

export default function MainScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { selectedPetId, setSelectedPetId, addEvent, formData, setFormData, addPet, updatePet, pets, setPets} = usePetContext();

  const router = useRouter(); 
  const {id} = useLocalSearchParams();

  const petToEdit = pets.find((pet) => pet.id ===id);

  useEffect(() =>{
    if (id && petToEdit){
      setFormData(petToEdit);
      setImageUri(petToEdit.imageUri || null );
      setSelectedPetId(petToEdit.id);
      console.log("selectedPetId", selectedPetId); 
    }
  }, [id]);

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

  // const updatePet = (id: string, updatedData: Partial<Pet>) => {
  //   setPets((prevPets) =>
  //     prevPets.map((pet) =>
  //       pet.id === id ? { ...pet, ...updatedData } : pet
  //     )
  //   );
  // };

  const handleSubmit = () => {
    const petId = Array.isArray(id) ? id[0] : id;

    if (petId) {
      updatePet(petId, {
        ...formData,
        imageUri: imageUri ?? formData.imageUri,
      });
    } else {
      addPet();
    }

    router.replace("/");
  };


  

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView>
          <CustomHeader title="Профиль питомца"/>
          <ScrollView contentContainerStyle={styles.container}>
          {/* <Text style={styles.title}>Профиль питомца</Text> */}
          <View style={styles.card}>
            {/* Tabs */}
            {/* <View style={styles.tabsContainer}>
              {TABS.map((tab) => (
                <TouchableOpacity key={tab} style={styles.tabButton}>
                  <Text style={styles.tabText}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View> */}

            <View style={styles.tabsContainer}>
              {TABS.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={styles.tabButton}
                  onPress={() => {
                    if (tab === "Календарь") {
                      router.push("/calendar");
                    }
                    if (petToEdit && tab ==="График"){
                      router.push({
                        pathname: "../events/[id]",
                        params: { id: petToEdit.id }
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
                  <Text style={styles.publishButtonText}>Сохранить</Text>
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
                {/* Кличка */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Кличка</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name || ""}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                  />
                </View>
                {/* Кличка по паспорту */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Кличка по паспорту</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.pasportName || ""}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, pasportName: text }))
                    }
                  />
                </View>
                {/* Пол */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Пол</Text>
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
                </View>
                {/* Остальные поля */}
                {[
                  ["Номер чипа", "chip"],
                  ["Порода", "breed"],
                  ["Вес", "weight"],
                  ["Рост в холке", "height"],
                  ["Окрас", "color"],
                  ["Примечание", "note"],
                ].map(([label, name]) => (
                  <View key={name} style={styles.inputGroup}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput
                      style={styles.input}
                      value={formData[name as keyof typeof formData] || ""}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, [name]: text }))
                      }
                    />
                  </View>
                ))}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Дата рождения</Text>
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
                      value={formData.birthdate ? new Date(formData.birthdate) : new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === "ios"); // на Android закрывается
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
              </View>
            </View>
          </View>
        </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <BottomMenu />
    </>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom:100,
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
    gap: 8, // расстояние между табами
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 12,
    marginBottom: 16,
    justifyContent: 'center'
  },
  tabButton: {
    paddingBottom: 6,
    marginRight: 2,
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
    marginBottom:60
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
  pickerWrapper: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
});
