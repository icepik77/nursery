import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ControlsBarProps = {
  filter: "all" | "домашние питомцы" | "крупные животные" | "птицы" | "мелкие животные";
  setFilter: React.Dispatch<
    React.SetStateAction<
      "all" | "домашние питомцы" | "крупные животные" | "птицы" | "мелкие животные"
    >
  >;
  sortAZ: boolean;
  setSortAZ: React.Dispatch<React.SetStateAction<boolean>>;
};

const categories: ControlsBarProps["filter"][] = [
  "all",
  "домашние питомцы",
  "крупные животные",
  "птицы",
  "мелкие животные",
];

export default function ControlsBar({ filter, setFilter, sortAZ, setSortAZ }: ControlsBarProps) {
  return (
    <View style={styles.container}>
      {/* Фильтр по категориям */}
      <View style={styles.filterRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.button, filter === cat && styles.activeButton]}
            onPress={() => setFilter(cat)}
          >
            <Text style={[styles.buttonText, filter === cat && styles.activeText]}>
              {cat === "all" ? "Все" : cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Сортировка */}
      <View style={styles.sortRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setSortAZ(!sortAZ)}
        >
          <Text style={styles.buttonText}>Сортировка: {sortAZ ? "A→Z" : "Z→A"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 8,
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  activeButton: {
    backgroundColor: "#00796b",
  },
  buttonText: {
    color: "#4B5563",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },
});
