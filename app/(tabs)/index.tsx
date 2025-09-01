import { Link, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePetContext } from "./context/formContext";

export default function HomeScreen() {
  const router = useRouter();
  const { pets } = usePetContext();

  // Импортируем компоненты только при рендере
  const BottomMenu = require("@/components/BottomMenu").default;
  const ControlsBar = require("@/components/ControlsBar").default;
  const PetCard = require("@/components/PetCard").default;

  // состояние фильтра и сортировки
  const [filter, setFilter] = useState<
    "all" | "домашние питомцы" | "крупные животные" | "птицы" | "мелкие животные"
  >("all");

  const [sortAZ, setSortAZ] = useState(true);

  // применяем фильтр и сортировку
  const filteredPets = useMemo(() => {
    let result = [...pets];

    // фильтрация
    if (filter !== "all") {
      result = result.filter((pet) => (pet.category ?? "") === filter);
    }

    // сортировка
    result.sort((a, b) => {
      const nameA = (a.name ?? "").toLowerCase();
      const nameB = (b.name ?? "").toLowerCase();
      return sortAZ ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    return result;
  }, [pets, filter, sortAZ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Главная</Text>

            <ControlsBar
              filter={filter}
              setFilter={setFilter}
              sortAZ={sortAZ}
              setSortAZ={setSortAZ}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/animal/createAnimal")}
            >
              <Text style={styles.addButtonText}>Добавить питомца</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredPets}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cardsContainer}
            renderItem={({ item: pet }) => (
              <Link
                href={{ pathname: "/animal/[id]", params: { id: pet.id } }}
                asChild
              >
                <PetCard
                  id={pet.id}
                  name={pet.name ?? "Без имени"}
                  breed={pet.breed}
                  gender={pet.gender}
                  age={pet.birthdate}
                  imageUrl={pet.imageUri}
                  category={pet.category}
                />
              </Link>
            )}
          />
        </View>
      </KeyboardAvoidingView>

      <BottomMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16, flex: 1 },
  header: { width: "100%", alignItems: "center", marginBottom: 12 },
  headerText: { fontSize: 28, fontWeight: "bold", marginBottom: 12, marginTop: 14 },
  addButton: {
    backgroundColor: "#00796b",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  cardsContainer: { paddingBottom: 100, gap: 2 },
});
