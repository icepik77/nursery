import BottomMenu from '@/components/BottomMenu';
import ProductCard from '@/components/ProductCard';
import { Ionicons } from "@expo/vector-icons"; // ← добавляем
import { useRouter } from "expo-router";
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useCart } from '../context/cartContext';
import { useProducts } from '../context/productContext';

export default function StoreTab() {
  const { products } = useProducts();
  const mockProducts = products;
  const { addToCart, cart } = useCart();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Магазин</Text>
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
        onPress={() => router.push("/(tabs)/shop/CartTab")}
      >
        <Ionicons name="cart" size={24} color="#fff" />
        <Text style={styles.cartCount}>{cart.length}</Text>
      </TouchableOpacity>

      <BottomMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f2f2f2" },
  row: { justifyContent: "space-between" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  cartButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    padding: 15,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  cartCount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
