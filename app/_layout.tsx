// app/_layout.tsx или app/layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "./(tabs)/context/authContext";
import { CartProvider } from "./(tabs)/context/cartContext";
import { PetProvider } from "./(tabs)/context/formContext";
import { ProductProvider } from "./(tabs)/context/productContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <PetProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </PetProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
