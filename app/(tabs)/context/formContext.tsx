import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";


// Тип для одного питомца
export type Pet = {
  id: string;
  name: string;
  gender: string;
  birthdate: string;
  chip: string;
  breed: string;
  weight: string;
  height: string;
  color: string;
  note: string;
  imageUri?: string;
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
  formData: PetForm;
  setFormData: React.Dispatch<React.SetStateAction<PetForm>>;
  addPet: () => void;
  addEvent: (petId: string, event: PetEvent) => void;
  removePet: (id: string) => void;
}

const PetContext = createContext<PetContextType | null>(null);

interface PetProviderProps {
  children: ReactNode;
}

export const PetProvider = ({ children }: PetProviderProps) => {

  const mockData: Pet[] = [
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
    },
    {
      id: "2",
      name: "Мурка",
      gender: "женский",
      birthdate: "2021-08-03",
      chip: "009876543",
      breed: "британская короткошерстная",
      weight: "4",
      height: "25",
      color: "голубой",
      note: "очень ласковая",
    },
    {
      id: "3",
      name: "Рекс",
      gender: "мужской",
      birthdate: "2020-12-01",
      chip: "004567891",
      breed: "овчарка",
      weight: "30",
      height: "60",
      color: "черно-подпалый",
      note: "служебная собака",
    },
    {
      id: "4",
      name: "Белка",
      gender: "женский",
      birthdate: "2018-03-21",
      chip: "003456789",
      breed: "лайка",
      weight: "18",
      height: "45",
      color: "белая",
      note: "охотничья собака",
    },
    {
      id: "5",
      name: "Том",
      gender: "мужской",
      birthdate: "2022-07-15",
      chip: "007654321",
      breed: "мейн-кун",
      weight: "7",
      height: "35",
      color: "рыжий",
      note: "любит играть с мячиком",
    },
  ];
  
  const [pets, setPets] = useState<Pet[]>(mockData);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const { id, ...firstPetForm } = mockData[0];
  const [formData, setFormData] = useState<PetForm>(firstPetForm);

  const [events, setEvents] = useState<Record<string, PetEvent[]>>({});

  const addPet = () => {
    if (formData.name && formData.birthdate) {
      console.log("formData.imageUri" + formData.imageUri);
      const newPet: Pet = {
        id: Date.now().toString(),
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
      });
    }
  };

  const addEvent = (petId: string, event: PetEvent) => {
    if (event.title && event.date) {
      setEvents((prev) => ({
        ...prev,
        [petId]: [...(prev[petId] || []), event],
      }));
    }
  };

  const removePet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setEvents((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    if (selectedPetId === id) {
      setSelectedPetId(null);
    }
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
        formData,
        setFormData,
        addPet,
        addEvent,
        removePet
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = (): PetContextType => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used within a PetProvider");
  }
  return context;
};
