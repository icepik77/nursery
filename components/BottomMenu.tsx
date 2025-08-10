import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabs = [
  { name: "Главная", icon: "home-outline", route: "/" },
  { name: "Календарь", icon: "calendar-outline", route: "/calendar" },
  { name: "Магазин", icon: "cart-outline", route: "/shop" },
  { name: "Профиль", icon: "person-outline", route: "/profile" },
];

export default function BottomMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {tabs.map(({ icon, route }) => {
        const isActive = pathname === route;

        return (
          <TouchableOpacity
            key={route}
            onPress={() => router.push(route)}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Ionicons
              name={icon}
              size={28}
              color={isActive ? "#041029" : "gray"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",

    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    // тень для iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // тень для Android
    elevation: 10,
  },
  button: {
    alignItems: "center",
    flex: 1,
  },
});
