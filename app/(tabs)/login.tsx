import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "./context/authContext";

export default function LoginScreen() {
  const { setUserAndToken } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("icepik77@mail.ru");
  const [login, setLogin] = useState("re");
  const [password, setPassword] = useState("Dark1271");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("http://83.166.244.36:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message || "Login failed");
      if (!data.user || !data.token) throw new Error("Invalid response: no user or token");

      await setUserAndToken(data.user, data.token);
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    setError("");
    try {
      const res = await fetch("http://83.166.244.36:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, login, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message || "Registration failed");
      if (!data.user || !data.token) throw new Error("Invalid response: no user or token");

      await setUserAndToken(data.user, data.token);
      router.replace("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать!</Text>
      <Text style={styles.subtitle}>Войдите в свою учетную запись</Text>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Login */}
      <Text style={styles.label}>Логин</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите логин"
        placeholderTextColor="#aaa"
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
      />

      {/* Password */}
      <Text style={styles.label}>Пароль</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите пароль"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Логин</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
        <Text style={styles.registerText}>Регистрация</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 30 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 5, marginLeft: 5 },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  button: {
    backgroundColor: "#00796b",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  registerButton: { backgroundColor: "#e0e0e0" },
  registerText: { color: "#333", fontSize: 16, fontWeight: "bold" },
});
