import { db } from "@/firebaseConfig";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, getDocs } from "firebase/firestore";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";


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
}

const PetContext = createContext<PetContextType | null>(null);

interface PetProviderProps {
  children: ReactNode;
}

const auth = getAuth();

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // firebaseUser — это User или null
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setPets([]);
      setEvents({});
      return;
    }

    loadPets();
  }, [user]);

  const { id, ...firstPetForm } = mockData[0];
  const [formData, setFormData] = useState<PetForm>(firstPetForm);

  const [events, setEvents] = useState<Record<string, PetEvent[]>>({});

  const loadPets = async () => {
    if (!user) {
      setPets([]);
      setEvents({});
      return;
    }

    const petsCollection = collection(db, "users", user.uid, "pets");
    const petsSnapshot = await getDocs(petsCollection);
    const loadedPets = petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPets(loadedPets);
  };

  const addPet = async () => {
    if (!user) {
      console.error("Пользователь не авторизован");
      return;
    }

    if (formData.name && formData.birthdate) {
      try {
        // Создаём документ в подколлекции pets
        const docRef = await addDoc(
          collection(db, "users", user.uid, "pets"),
          formData
        );

        console.log("Питомец сохранён в Firestore с ID:", docRef.id);

        // Очищаем форму
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

        // Опционально: сразу подгрузить нового питомца
        // или оставить на автообновлении через loadPets
        loadPets();
      } catch (error) {
        console.error("Ошибка при сохранении питомца:", error);
      }
    }
  };

  const addEvent = async (petId: string, event: PetEvent) => {
    const user = auth.currentUser;
    if (!user) return; // Если пользователь не авторизован

    if (event.title && event.date) {
      try {
        // 1️⃣ Сохраняем в Firestore
        await addDoc(collection(db, "users", user.uid, "events"), {
          petId,
          title: event.title,
          date: event.date,
          createdAt: new Date()
        });

        // 2️⃣ Обновляем локальный state
        setEvents((prev) => ({
          ...prev,
          [petId]: [...(prev[petId] || []), event],
        }));

      } catch (e) {
        console.error("Ошибка при добавлении события:", e);
      }
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
