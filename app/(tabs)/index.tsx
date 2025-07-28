import { Link, useRouter } from "expo-router";
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import ControlsBar from "@/components/ControlsBar";
import PetCard from "@/components/PetCard";

import { usePetContext } from "./context/formContext";

export default function Index() {
  const router = useRouter();
  const { pets } = usePetContext();


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Шапка */}
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

      {/* Карточки */}
        <View style={styles.cardsContainer}>
          {pets.map((pet) => (
            <Link href={{
              pathname: '/animal/[id]',
              params: { id: 'bacon' }
            }} asChild key={pet.id}>
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
  form: {
    padding: 10,
    backgroundColor: '#f4f4f4'
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#3366ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  item: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginTop: 17
  },
  itemText: {
    color: '#555'
  },
  container: {
    alignItems: "center",
    padding: 16,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#041029",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  cardsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  picker: {
    height: 50,
    width:50
  },
});

