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
  category?: string;
  pasportName?: string; // ✅ добавили поле для паспортного имени
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
  // 🐱 Домашние питомцы
  {
    id: "1",
    name: "Барсик",
    pasportName: "Барсик Барсович",
    gender: "мужской",
    birthdate: "2019-05-12",
    chip: "001234567",
    breed: "сибирская",
    weight: "6",
    height: "28",
    color: "серый",
    note: "любит лазать по шкафам",
    category: "домашние питомцы",
  },
  {
    id: "2",
    name: "Мурка",
    pasportName: "Мурка Муркина",
    gender: "женский",
    birthdate: "2021-08-03",
    chip: "009876543",
    breed: "британская",
    weight: "4",
    height: "25",
    color: "голубой",
    note: "очень ласковая",
    category: "домашние питомцы",
  },
  {
    id: "3",
    name: "Рекс",
    pasportName: "Рекс Рексович",
    gender: "мужской",
    birthdate: "2020-02-20",
    chip: "002345678",
    breed: "немецкая овчарка",
    weight: "32",
    height: "60",
    color: "черный с рыжим",
    note: "служебная собака",
    category: "домашние питомцы",
  },
  {
    id: "4",
    name: "Лаки",
    pasportName: "Лаки Лакина",
    gender: "женский",
    birthdate: "2022-06-14",
    chip: "004567890",
    breed: "йоркширский терьер",
    weight: "3",
    height: "23",
    color: "золотистый",
    note: "боится громких звуков",
    category: "домашние питомцы",
  },

  // 🐴 Крупные животные
  {
    id: "11",
    name: "Гроза",
    pasportName: "Гроза Грозович",
    gender: "мужской",
    birthdate: "2016-04-01",
    chip: "100123456",
    breed: "рысак",
    weight: "450",
    height: "165",
    color: "вороная",
    note: "быстрый бегун",
    category: "крупные животные",
  },
  {
    id: "12",
    name: "Зорька",
    pasportName: "Зорька Зорькина",
    gender: "женский",
    birthdate: "2018-07-21",
    chip: "100987654",
    breed: "айрширская корова",
    weight: "550",
    height: "140",
    color: "рыже-белая",
    note: "дает много молока",
    category: "крупные животные",
  },

  // 🕊 Птицы
  {
    id: "21",
    name: "Кеша",
    pasportName: "Кеша Кешин",
    gender: "мужской",
    birthdate: "2022-03-11",
    chip: "200123456",
    breed: "волнистый попугай",
    weight: "0.05",
    height: "18",
    color: "зелёный",
    note: "повторяет слова",
    category: "птицы",
  },
  {
    id: "22",
    name: "Снежинка",
    pasportName: "Снежинка Снежинкина",
    gender: "женский",
    birthdate: "2021-12-30",
    chip: "200987654",
    breed: "канарейка",
    weight: "0.02",
    height: "15",
    color: "жёлтый",
    note: "поёт по утрам",
    category: "птицы",
  },

  // 🐹 Мелкие животные
  {
    id: "27",
    name: "Шуша",
    pasportName: "Шуша Шушина",
    gender: "женский",
    birthdate: "2023-05-05",
    chip: "300123456",
    breed: "шиншилла",
    weight: "0.6",
    height: "20",
    color: "серебристый",
    note: "очень пушистая",
    category: "мелкие животные",
  },
  {
    id: "28",
    name: "Пухлик",
    pasportName: "Пухлик Пухликович",
    gender: "мужской",
    birthdate: "2023-09-09",
    chip: "300987654",
    breed: "хомяк",
    weight: "0.1",
    height: "8",
    color: "белый",
    note: "любит бегать в колесе",
    category: "мелкие животные",
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
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
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
