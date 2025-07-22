import React, { useState } from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

export default function ControlsBar() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [filterValue, setFilterValue] = useState(null);
  const [sortValue, setSortValue] = useState(null);

  const [filterItems, setFilterItems] = useState([
    { label: "Фильтр", value: null },
    { label: "Собаки", value: "Собаки" },
    { label: "Кошки", value: "Кошки" },
  ]);

  const [sortItems, setSortItems] = useState([
    { label: "Сортировка", value: null },
    { label: "По имени", value: "По имени" },
    { label: "По возрасту", value: "По возрасту" },
  ]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Поиск питомца..."
        placeholderTextColor="#999"
      />

      <View style={styles.selectContainer}>
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={filterOpen}
            value={filterValue}
            items={filterItems}
            setOpen={setFilterOpen}
            setValue={setFilterValue}
            setItems={setFilterItems}
            placeholder="Фильтр"
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>

        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={sortOpen}
            value={sortValue}
            items={sortItems}
            setOpen={setSortOpen}
            setValue={setSortValue}
            setItems={setSortItems}
            placeholder="Сортировка"
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 16 : 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    width: "100%"
  },
  dropdownWrapper: {
    flex: 1,
    zIndex: 1000, // для корректного наложения выпадающих списков
    width:"100%"
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownContainer: {
    borderColor: "#ccc",
  },
});
