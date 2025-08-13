// screens/LoginScreen.tsx
import { signIn, signInWithGoogle, signUp } from "@/utils/utils"; // добавь метод входа через Google
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("icepik77@mail.ru");
  const [password, setPassword] = useState("Dark1271");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      await signUp(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать!</Text>
      <Text style={styles.subtitle}>Войдите в свою учетную запись</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Google_%22G%22_Logo.svg" }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
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
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#041029",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#e0e0e0",
  },
  registerText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#999",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
