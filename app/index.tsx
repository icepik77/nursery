// app/index.tsx
import { Redirect } from "expo-router";
import { useState } from "react";
import HomeScreen from "./(tabs)";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return <HomeScreen />;
}
