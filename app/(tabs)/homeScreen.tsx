import ControlsBar from "@/components/ControlsBar";
import PetCard from "@/components/PetCard";
import { Link, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePetContext } from "./context/formContext";

export default function HomeScreen() {
  const router = useRouter();
  const { pets } = usePetContext();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Главная</Text>
        <ControlsBar />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/createAnimal")}
        >
          <Text style={styles.addButtonText}>Добавить питомца</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/calendar")}
        >
          <Text style={styles.addButtonText}>Перейти в календарь</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {pets.map((pet) => (
          <Link
            href={{
              pathname: "/animal/[id]",
              params: { id: pet.id }
            }}
            asChild
            key={pet.id}
          >
            <PetCard
              id={pet.id}
              name={pet.name}
              breed={pet.breed}
              gender={pet.gender}
              age={"1 год"}
              imageUrl={pet.imageUri}
            />
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16 },
  header: { width: "100%", alignItems: "center", marginBottom: 24 },
  headerText: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
  addButton: {
    backgroundColor: "#041029",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  cardsContainer: { width: "100%", alignItems: "center", gap: 16 },
});
