// app/products/[id].tsx
import BottomMenu from "@/components/BottomMenu";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../../context/cartContext";
import { useProducts } from "../../context/productContext";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products} = useProducts();
  const {addToCart} = useCart();
  const router = useRouter();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Товар не найден</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "blue", marginTop: 10 }}>Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={
              product.image
              ? { uri: product.image }
              : require("@/assets/images/product-avatar.png") // путь к дефолтной картинке
          }
          style={styles.image}
        />

        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{product.price} ₽</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.description}>{product.longDescription}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.addButtonText}>Добавить в корзину</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomMenu />
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  price: {
    fontSize: 18,
    color: "#00796b",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
    textAlign: "justify",
  },
  addButton: {
    backgroundColor: "#00796b",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
