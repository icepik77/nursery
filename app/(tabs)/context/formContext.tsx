import React, { createContext, ReactNode, useContext, useState } from "react";

// Тип для одного питомца
export type Pet = {
  id: string;
  name?: string;
  gender?: string;
  birthdate?: string;
  chip?: string;
  breed?: string;
  weight?: string;
  height?: string;
  color?: string;
  note?: string;
  imageUri?: string;
  bigNote?: string;
  category?: string; // ✅ добавили категорию
};

// Тип формы без id
export type PetForm = Omit<Pet, "id">;

// Тип одного события
export type PetEvent = {
  title: string;
  date: string;
};

interface PetContextType {
  pets: Pet[];
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  selectedPetId: string | null;
  setSelectedPetId: (id: string | null) => void;
  selectedPet: Pet | null;
  selectedPetEvents: PetEvent[];
  allEvents: Record<string, PetEvent[]>;
  formData: PetForm;
  setFormData: React.Dispatch<React.SetStateAction<PetForm>>;
  addPet: () => void;
  addEvent: (petId: string, event: PetEvent) => void;
  removePet: (id: string) => void;
  updateEvent: (petId: string, index: number, updatedEvent: PetEvent) => void;
  deleteEvent: (petId: string, index: number) => void;
  user: { id: string; name: string } | null;
}

const PetContext = createContext<PetContextType | null>(null);

interface PetProviderProps {
  children: ReactNode;
}

// Моковый пользователь
const mockUser = { id: "u1", name: "Тестовый пользователь" };

// Моковые питомцы
const mockPets: Pet[] = [
  {
    id: "1",
    name: "Барсик",
    gender: "мужской",
    birthdate: "2019-05-12",
    chip: "001234567",
    breed: "сибирская",
    weight: "6",
    height: "28",
    color: "серый",
    note: "любит лазать по шкафам",
    category: "домашние питомцы", // ✅ категория
  },
  {
    id: "2",
    name: "Мурка",
    gender: "женский",
    birthdate: "2021-08-03",
    chip: "009876543",
    breed: "британская",
    weight: "4",
    height: "25",
    color: "голубой",
    note: "очень ласковая",
    category: "домашние питомцы", // ✅ категория
  },
];

export const PetProvider = ({ children }: PetProviderProps) => {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(mockPets[0]?.id || null);
  const [user] = useState(mockUser);

  const { id, ...firstPetForm } = mockPets[0] || {};
  const [formData, setFormData] = useState<PetForm>(firstPetForm);

  const [events, setEvents] = useState<Record<string, PetEvent[]>>({});

  const addPet = () => {
    if (!formData.name) return;

    const newPet: Pet = {
      id: (pets.length + 1).toString(),
      ...formData,
    };

    setPets((prev) => [...prev, newPet]);

    setFormData({
      name: "",
      gender: "",
      birthdate: "",
      chip: "",
      breed: "",
      weight: "",
      height: "",
      color: "",
      note: "",
      imageUri: "",
      bigNote: "",
      category: "", // ✅ сброс категории
    });
  };

  const addEvent = (petId: string, event: PetEvent) => {
    if (!event.title || !event.date) return;

    setEvents((prev) => ({
      ...prev,
      [petId]: [...(prev[petId] || []), event],
    }));
  };

  const removePet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setEvents((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    if (selectedPetId === id) setSelectedPetId(null);
  };

  const updateEvent = (petId: string, index: number, updatedEvent: PetEvent) => {
    setEvents((prev) => {
      const updatedEvents = [...(prev[petId] || [])];
      updatedEvents[index] = updatedEvent;
      return { ...prev, [petId]: updatedEvents };
    });
  };

  const deleteEvent = (petId: string, index: number) => {
    setEvents((prev) => {
      const updatedEvents = [...(prev[petId] || [])];
      updatedEvents.splice(index, 1);
      return { ...prev, [petId]: updatedEvents };
    });
  };

  const selectedPet = pets.find((pet) => pet.id === selectedPetId) || null;
  const selectedPetEvents = events[selectedPetId ?? ""] || [];

  return (
    <PetContext.Provider
      value={{
        pets,
        setPets,
        selectedPetId,
        setSelectedPetId,
        selectedPet,
        selectedPetEvents,
        allEvents: events,
        formData,
        setFormData,
        addPet,
        addEvent,
        removePet,
        updateEvent,
        deleteEvent,
        user,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = (): PetContextType => {
  const context = useContext(PetContext);
  if (!context) throw new Error("usePetContext must be used within a PetProvider");
  return context;
};
