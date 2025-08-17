import BottomMenu from "@/components/BottomMenu";
import { Ionicons } from "@expo/vector-icons"; // ✅ импорт иконок
import { useRouter } from "expo-router";
import React from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/cartContext";

export default function CartTab() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const checkout = () => {
    Alert.alert("Заказ оформлен", `Сумма: ${total} ₽`);
    clearCart();
  };

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <Text style={styles.empty}>Корзина пуста</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.itemLeft}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image-outline" size={32} color="#bbb" />
                    </View>
                  )}
                  <View style={styles.textBlock}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>{item.price} ₽</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="red" /> 
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.summary}>
            <Text style={styles.total}>Итого: {total} ₽</Text>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push(`/(tabs)/shop/CheckoutTab`)}>
              <Text style={styles.checkoutText}>Оформить заказ</Text>
            </TouchableOpacity>
            
          </View>
        </>
      )}
      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f2f2f2", marginTop: 20, },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#999" },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  name: { fontSize: 14, fontWeight: "600", color: "#333" },
  price: { fontSize: 14, color: "#00796b", marginTop: 2 },
  summary: {
    marginTop: 15,
    marginBottom: 80,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  total: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  checkoutBtn: {
    backgroundColor: "#00bfa5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "600" },
  textBlock: {
    flexDirection: "column",
  },
});