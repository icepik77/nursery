import ProductCard from '@/components/ProductCard';
import { useRouter } from "expo-router";
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from '../context/cartContext';
import { useProducts } from '../context/productContext';

// console.log("RootLayout children:", React.Children.toArray(children));


export default function StoreTab() {
  const {products} = useProducts();
  const mockProducts = products;
  const { addToCart, cart } = useCart();
  const router = useRouter();

  return (
    <View style={styles.container}>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
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
