import { Stack } from "expo-router";
import { PetProvider } from "./(tabs)/context/formContext";

export default function RootLayout() {
   return (
    <PetProvider>
      <Stack />
    </PetProvider>
  );
}
