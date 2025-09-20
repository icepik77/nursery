import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth, User } from "./authContext";


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
  pasportName?: string;
};

export type PetForm = Omit<Pet, "id">;

export type PetEvent = {
  id?: string; // будет присваиваться сервером
  title: string;
  date: string;
};

export type Note = {
  id: string;
  pet_id: string;
  text: string;
  category: string;
  created_at: string;
  updated_at?: string;
};

// Тип файла
export type PetFile = {
  id: string;
  pet_id: string;
  name: string;
  uri: string;
  type?: string;  // MIME type
  size?: number;
  created_at: string;
  updated_at?: string;
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
  addPet: () => Promise<void>;
  updatePet: (id: string, updatedData: Partial<PetForm>) => Promise<void>; // ← добавлено
  fetchEvents: (petId: string) => Promise<void>;
  addEvent: (petId: string, event: PetEvent) => void;
  removePet: (id: string) => Promise<void>;
  updateEvent: (petId: string, index: number, updatedEvent: PetEvent) => void;
  deleteEvent: (petId: string, index: number) => void;
  user: User | null;
  notes: Note[];
  fetchNotes: (petId: string) => Promise<void>;
  addNote: (petId: string, text: string) => Promise<void>;
  updateNote: (noteId: string, text: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  files: PetFile[];
  fetchFiles: (petId: string) => Promise<void>;
  addFile: (petId: string, file: { name: string; uri: string; type?: string; size?: number }) => Promise<void>;
  updateFile: (fileId: string, updatedData: Partial<PetFile>) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  medical: PetMedical[];
  fetchMedical: (petId: string) => Promise<void>;
  addMedical: (petId: string, data: { title: string; content?: string; category?: string }) => Promise<void>;
  updateMedical: (id: string, data: Partial<PetMedical>) => Promise<void>;
  deleteMedical: (id: string) => Promise<void>;
}


export type MedicalCategory = 'vaccination' | 'treatment' | 'surgery' | 'other';

export type PetMedical = {
  id: string;
  pet_id: string;
  title: string;
  content?: string;
  created_at: string;
  updated_at?: string;
  category: MedicalCategory;
};

const PetContext = createContext<PetContextType | null>(null);

interface PetProviderProps {
  children: ReactNode;
}

export const PetProvider = ({ children }: PetProviderProps) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const {user} = useAuth();

  const [formData, setFormData] = useState<PetForm>({});
  const [events, setEvents] = useState<Record<string, PetEvent[]>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [files, setFiles] = useState<PetFile[]>([]);
  const [medical, setMedical] = useState<PetMedical[]>([]);

  const fetchPets = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("user", user); 
      if (!token || !user) {
        // console.error("Нет токена → пользователь не авторизован");
        return;
      }

      console.log("user.id", user.id); 

      const res = await axios.get(
        `http://83.166.244.36:3000/api/pets?userId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 теперь с токеном
          },
        }
      );

      setPets(res.data.map((p: any) => ({
        ...p,
        imageUri: p.imageuri,
        bigNote: p.bignote,
        pasportName: p.pasportname
      })));
      console.log("res.data", res.data); 
      if (res.data.length > 0) {
        setSelectedPetId(res.data[0].id);
        setFormData(res.data[0]);
      }
    } catch (err) {
      console.error("Ошибка загрузки питомцев", err);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [user]);

  useEffect(() => {
    if (!pets.length) return;

    pets.forEach((pet) => {
      fetchEvents(pet.id);
    });
  }, [pets]);

  const addPet = async () => {
    console.log("userAddPet", user);
    if (!user) {
      console.error("Пользователь не авторизован");
      return;
    }
    if (!formData.name) {
      console.error("Имя питомца не указано");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      // Готовим данные в формате FormData
      const dataToSend = new FormData();
      Object.entries({ ...formData, user_id: user.id }).forEach(([key, value]) => {
        if (value) {
          if (key === "imageUri") {
            dataToSend.append("image", {
              uri: value as string,
              type: "image/jpeg", // тут лучше mime определять
              name: "pet-photo.jpg",
            } as any);
          } else {
            dataToSend.append(key, value as string);
          }
        }
      });

      // POST-запрос
      const res = await axios.post(
        "http://83.166.244.36:3000/api/pets",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Ответ сервера:", res.data);

      await fetchPets();

      // Сброс формы
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
        category: "",
        pasportName: "",
      });
    } catch (err: any) {
      if (err.response) {
        console.error("Ошибка сервера:", err.response.data);
      } else {
        console.error("Ошибка добавления питомца:", err.message);
      }
    }
  };


  const updatePet = async (id: string, updatedData: Partial<PetForm>) => {
  if (!user) {
    console.error("Пользователь не авторизован");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Нет токена");

    // PUT-запрос для обновления питомца
    const res = await axios.put(
      `http://83.166.244.36:3000/api/pets/${id}`,
      updatedData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Питомец обновлён:", res.data);

    // Обновляем локальный список питомцев
    setPets((prevPets) =>
      prevPets.map((pet) => (pet.id === id ? { ...pet, ...res.data } : pet))
    );

    // Если обновляется выбранный питомец — обновляем форму
    if (selectedPetId === id) {
      setFormData((prev) => ({ ...prev, ...res.data }));
    }
  } catch (err: any) {
    if (err.response) {
      console.error("Ошибка сервера:", err.response.data);
    } else {
      console.error("Ошибка обновления питомца:", err.message);
    }
  }
};

  const removePet = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      await axios.delete(`http://83.166.244.36:3000/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      fetchPets();
      setEvents((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      if (selectedPetId === id) setSelectedPetId(null);
    } catch (err) {
      console.error("Ошибка удаления питомца", err);
    }
  };

  const fetchEvents = async (petId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      const res = await axios.get(
        `http://83.166.244.36:3000/api/events?petId=${petId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ответ от API должен быть массивом событий [{ id, title, event_date }]
      const formattedEvents = res.data.map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        date: ev.event_date, // если сервер возвращает ISO-дату, можно оставить так
      }));

      setEvents((prev) => ({
        ...prev,
        [petId]: formattedEvents,
      }));
    } catch (err: any) {
      console.error("Ошибка загрузки событий:", err.response?.data || err.message);
    }
  };

  // Добавляем событие и сохраняем в БД
  const addEvent = async (petId: string, event: PetEvent) => {
    if (!event.title || !event.date) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      const res = await axios.post(
        "http://83.166.244.36:3000/api/events",
        {
          petId: petId,
          title: event.title,
          event_date: event.date.split("T")[0], // сохраняем только дату
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // обновляем локальный стейт
      setEvents((prev) => ({
        ...prev,
        [petId]: [...(prev[petId] || []), { title: res.data.title, date: res.data.event_date }],
      }));
    } catch (err: any) {
      console.error("Ошибка добавления события:", err.response?.data || err.message);
    }
  };

  // Обновляем событие
  const updateEvent = async (petId: string, index: number, updatedEvent: PetEvent) => {
    const eventToUpdate = events[petId]?.[index];
    if (!eventToUpdate) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      // предполагаем, что сервер знает id события
      // например, передаем его через индекс или сохраняем id в состоянии
      const eventId = (eventToUpdate as any).id; // добавьте id в PetEvent для работы с БД
      const res = await axios.put(
        `http://83.166.244.36:3000/api/events/${eventId}`,
        { title: updatedEvent.title, event_date: updatedEvent.date.split("T")[0] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prev) => {
        const updatedEvents = [...(prev[petId] || [])];
        updatedEvents[index] = { title: res.data.title, date: res.data.event_date };
        return { ...prev, [petId]: updatedEvents };
      });
    } catch (err) {
      console.error("Ошибка обновления события:", err);
    }
  };

  // Удаляем событие
    const deleteEvent = async (petId: string, index: number) => {
      const eventToDelete = events[petId]?.[index];
      if (!eventToDelete) return;

      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("Нет токена");

        const eventId = (eventToDelete as any).id; // также нужен id события
        await axios.delete(`http://83.166.244.36:3000/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents((prev) => {
          const updatedEvents = [...(prev[petId] || [])];
          updatedEvents.splice(index, 1);
          return { ...prev, [petId]: updatedEvents };
        });
      } catch (err) {
        console.error("Ошибка удаления события:", err);
      }
    };

  // Получить все заметки для питомца
  const fetchNotes = async (petId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !user) return;

      const res = await axios.get(`http://83.166.244.36:3000/api/notes?petId=${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(res.data);
    } catch (err) {
      console.error("Ошибка загрузки заметок", err);
    }
  };

  // Добавить новую заметку
  const addNote = async (petId: string, text: string) => {
    if (!text.trim()) return;

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      const res = await axios.post(
        "http://83.166.244.36:3000/api/notes",
        { pet_id: petId, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes(prev => [res.data, ...prev]);
    } catch (err: any) {
      console.error("Ошибка добавления заметки", err.response?.data || err.message);
    }
  };

  // Обновить существующую заметку
  const updateNote = async (noteId: string, text: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      const res = await axios.put(
        `http://83.166.244.36:3000/api/notes/${noteId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotes(prev => prev.map(n => (n.id === noteId ? res.data : n)));
    } catch (err) {
      console.error("Ошибка обновления заметки", err);
    }
  };

  // Удалить заметку
  const deleteNote = async (noteId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      await axios.delete(`http://83.166.244.36:3000/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) {
      console.error("Ошибка удаления заметки", err);
    }
  };

  // Получить все файлы для питомца
  const fetchFiles = async (petId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !user) return;

      const res = await axios.get(`http://83.166.244.36:3000/api/files?petId=${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFiles(res.data);
    } catch (err) {
      console.error("Ошибка загрузки файлов", err);
    }
  };

  // Добавить новый файл
  const addFile = async (petId: string, file: { name: string; uri: string; type?: string; size?: number }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !user) throw new Error("Нет токена");

      const res = await axios.post(
        "http://83.166.244.36:3000/api/files",
        { pet_id: petId, ...file },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFiles(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("Ошибка добавления файла", err);
    }
  };

  // Обновить файл
  const updateFile = async (fileId: string, updatedData: Partial<PetFile>) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      const res = await axios.put(
        `http://83.166.244.36:3000/api/files/${fileId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFiles(prev => prev.map(f => (f.id === fileId ? res.data : f)));
    } catch (err) {
      console.error("Ошибка обновления файла", err);
    }
  };

  // Удалить файл
  const deleteFile = async (fileId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      await axios.delete(`http://83.166.244.36:3000/api/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (err) {
      console.error("Ошибка удаления файла", err);
    }
  };

  // Получить все записи
  const fetchMedical = async (petId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !user) return;

      const res = await axios.get(
        `http://83.166.244.36:3000/api/medical?petId=${petId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMedical(res.data);
    } catch (err) {
      console.error("Ошибка загрузки мед. записей", err);
    }
  };

  // Добавить новую запись
  const addMedical = async (petId: string, data: { title: string; content?: string; category?: string }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      const res = await axios.post(
        "http://83.166.244.36:3000/api/medical",
        { pet_id: petId, ...data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedical(prev => [res.data, ...prev]);
    } catch (err: any) {
      console.error("Ошибка добавления мед. записи", err.response?.data || err.message);
    }
  };

  // Обновить запись
  const updateMedical = async (id: string, data: Partial<PetMedical>) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      const res = await axios.put(
        `http://83.166.244.36:3000/api/medical/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedical(prev => prev.map(m => (m.id === id ? res.data : m)));
    } catch (err) {
      console.error("Ошибка обновления мед. записи", err);
    }
  };

  // Удалить запись
  const deleteMedical = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Нет токена");

      await axios.delete(
        `http://83.166.244.36:3000/api/medical/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMedical(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error("Ошибка удаления мед. записи", err);
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
        allEvents: events,
        formData,
        setFormData,
        addPet,
        updatePet,
        addEvent,
        removePet,
        fetchEvents,
        updateEvent,
        deleteEvent,
        user: user,
        notes,
        fetchNotes,
        addNote,
        updateNote,
        deleteNote,
        files,
        fetchFiles,
        addFile,
        updateFile,
        deleteFile,
        medical,
        fetchMedical,
        addMedical,
        updateMedical,
        deleteMedical,
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
