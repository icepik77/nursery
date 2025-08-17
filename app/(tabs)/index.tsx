import BottomMenu from "@/components/BottomMenu";
import ControlsBar from "@/components/ControlsBar";
import PetCard from "@/components/PetCard";
import { Link, useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePetContext } from "./context/formContext";

export default function HomeScreen() {
  const router = useRouter();
  const { pets } = usePetContext();

  return (
    <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>Главная</Text>
            <ControlsBar />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push("/animal/createAnimal")}
            >
              <Text style={styles.addButtonText}>Добавить питомца</Text>
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
                  name={pet.name ?? "Без имени"}
                  breed={pet.breed}
                  gender={pet.gender}
                  age={pet.birthdate}
                  imageUrl={pet.imageUri}
                />
              </Link>
            ))}
          </View>
        </ScrollView>
        <BottomMenu />
      </View>
    </KeyboardAvoidingView>
    
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 16, flex: 1 },
  header: { width: "100%", alignItems: "center", marginBottom: 24 },
  headerText: { fontSize: 28, fontWeight: "bold", marginBottom: 12, marginTop:14 },
  addButton: {
    backgroundColor: "#00796b",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  addButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  cardsContainer: { width: "100%", alignItems: "center", gap: 2 },
});
