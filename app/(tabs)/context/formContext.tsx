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
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const defaultFormData = {
    name: "",
    gender: "мужской",
    birthdate: "2020-01-01",
    chip: "123456789",
    breed: "дворняга",
    weight: "10",
    height: "30",
    color: "белый",
    note: "без примечаний",
  };

  const [formData, setFormData] = useState<PetForm>(defaultFormData);

  const [events, setEvents] = useState<Record<string, PetEvent[]>>({});

  const addPet = () => {
    if (formData.name && formData.birthdate) {
      console.log("formData.imageUri" + formData.imageUri);
      const newPet: Pet = {
        id: Date.now().toString(),
        ...formData,
      };
      setPets((prev) => [...prev, newPet]);
      // setFormData({
      //   name: "",
      //   gender: "",
      //   birthdate: "",
      //   chip: "",
      //   breed: "",
      //   weight: "",
      //   height: "",
      //   color: "",
      //   note: "",
      // });
      setFormData(defaultFormData);
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
