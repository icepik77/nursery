import { Stack } from "expo-router";
import { AuthProvider } from "./(tabs)/context/authContext";
import { PetProvider } from "./(tabs)/context/formContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <PetProvider>
        <Stack />
      </PetProvider>
    </AuthProvider>
  );
}