import { Stack } from "expo-router";
import { AuthProvider } from "./(tabs)/context/authContext";
import { CartProvider } from "./(tabs)/context/cartContext";
import { PetProvider } from "./(tabs)/context/formContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <PetProvider>
          <Stack screenOptions={{ headerShown: false }}/>
        </PetProvider>
      </CartProvider>
    </AuthProvider>
  );
}