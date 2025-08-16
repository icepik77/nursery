import ProductCard from '@/components/ProductCard';
import { useRouter } from "expo-router";
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from '../context/cartContext';

const mockProducts = [
  {
    id: "1",
    name: "Витамины для собак",
    description: "Поддержка иммунитета и здоровья шерсти",
    price: 450,
    image: "https://place-puppy.com/200x150",
  },
  {
    id: "2",
    name: "Антигельминтный препарат",
    description: "Эффективно против паразитов",
    price: 700,
    image: "https://placekitten.com/200/150",
  },
  {
    id: "3",
    name: "Шампунь для кошек",
    description: "Нежный уход за шерстью",
    price: 350,
    image: "https://placekitten.com/201/150",
  },
  {
    id: "4",
    name: "Капли для ушей",
    description: "Уход и чистка ушей питомца",
    price: 500,
    image: "https://place-puppy.com/201x150",
  },
];

export default function StoreTab() {
  const { addToCart, cart } = useCart();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={mockProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => <ProductCard product={item} onBuy={addToCart} />}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />

      {/* Кнопка корзины */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push("/(tabs)/shop/CartTab")} // навигация в таб корзины
      >
        <Text style={styles.cartText}>🛒 {cart.length}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f2f2f2" },
  row: { justifyContent: "space-between" },

  cartButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  cartText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
