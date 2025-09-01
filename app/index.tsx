// app/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import React, { Suspense, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./(tabs)/context/authContext";
const HomeScreen = React.lazy(() => import("./(tabs)"));

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    logout();

    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log("token", token); 
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);

  if (isLoggedIn === null) {
    // пока идет проверка — спиннер
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }


  return (
    <Suspense fallback={<ActivityIndicator />}>
      <HomeScreen />
    </Suspense>
  );
}
