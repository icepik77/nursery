// example: app/(tabs)/shop.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <Text>Заглушка Магазина</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent: "center", alignItems: "center" },
});
