// authContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
  login: string | "Пользователь";
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUserAndToken: (user: User, token: string) => Promise<void>;
  updateUser: (partialUser: Partial<User>) => Promise<void>; // локально
  updatePassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadAuth = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      const savedUser = await AsyncStorage.getItem("user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    loadAuth();
  }, []);

  const setUserAndToken = async (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    await AsyncStorage.setItem("token", newToken);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  };

  const updateUser = async (partialUser: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...partialUser };

    const response = await fetch(
      `http://83.166.244.36:3000/api/auth/${user.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при обновлении профиля");
    }

    const data = await response.json();
    setUser(data);
    await AsyncStorage.setItem("user", JSON.stringify(data));
  };

  const updatePassword = async (password: string) => {
    if (!user) return;

    const response = await fetch(
      `http://83.166.244.36:3000/api/auth/${user.id}/password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при смене пароля");
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/login"); // перенаправляем на экран логина
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setUserAndToken,
        updateUser,
        updatePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
