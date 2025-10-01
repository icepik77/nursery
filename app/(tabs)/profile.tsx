import BottomMenu from "@/components/BottomMenu";
import CustomHeader from "@/components/CustomHeader";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./context/authContext";

export default function ProfileScreen() {
  const { user, updateUser, updatePassword, logout } = useAuth();
  const router = useRouter(); 

  if (!user) {
    return <Text style={styles.loading}>Загрузка...</Text>;
  }

  const [login, setLogin] = useState(user.login);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(user.avatar);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) return;
    console.log("result.assets[0].uri", result.assets[0].uri);
    setAvatar(result.assets[0].uri);
  };

 const handleSave = () => {
    updateUser({ login, email, avatar });
    if (password) {
      updatePassword(password);
    }
    router.back(); // 👈 возвращаемся на предыдущую страницу
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          <CustomHeader title="Профиль"/>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Аватар */}
            <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
              <Image
                source={
                  avatar
                    ? { uri: avatar }
                    : require("@/assets/images/avatar_man.png")
                }
                style={styles.avatar}
              />
              <Text style={styles.changePhoto}>Изменить фото</Text>
            </TouchableOpacity>

            {/* Поля */}
            <View style={styles.form}>
              <Text style={styles.label}>Логин</Text>
              <TextInput
                value={login}
                onChangeText={setLogin}
                style={styles.input}
              />

              {/* <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              /> */}

              <Text style={styles.label}>Пароль</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Введите новый пароль"
                secureTextEntry
                style={styles.input}
              />
            </View>

            {/* Кнопки */}
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Сохранить</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Выйти</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Нижнее меню */}
      <BottomMenu />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 120, // запас под BottomMenu
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 25,
    marginTop: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#00796b",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  changePhoto: {
    marginTop: 10,
    color: "#4a90e2",
    fontWeight: "500",
  },
  form: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttons: {
    width: "100%",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#00796b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#041029",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
