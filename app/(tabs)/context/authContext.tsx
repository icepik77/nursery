// authContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUserAndToken: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, setUserAndToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
