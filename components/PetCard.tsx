import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { usePetContext } from "@/app/(tabs)/context/formContext";

interface PetCardProps {
  id: string;
  name: string;
  age: string;
  imageUrl?: any;
}

export default function PetCard({ id, name, age, imageUrl }: PetCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { removePet, setSelectedPetId } = usePetContext();

  const handleEdit = () => {
    setSelectedPetId(id);
    // Навигация в форму изменения (если она есть)
    // Пример: router.push("/editAnimal");
    setMenuOpen(false);
  };

  const handleDelete = () => {
    removePet(id);
    setMenuOpen(false);
  };

  return (
    <View style={styles.card}>
      <Image source={imageUrl} style={styles.image} />
      <View style={styles.rightContent}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <Text style={styles.menuText}>⋯</Text>
          </TouchableOpacity>
        </View>
        <Text>{age}</Text>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={menuOpen}
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Text>✏️ Изменить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Text style={{ color: "red" }}>🗑️ Удалить</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}



// export default function PetCard({ name, age, imageUrl }: PetCardProps) {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <View style={styles.card}>
//       {/* Левая часть — фото */}
//       <Image source={imageUrl} style={styles.image} />

//       {/* Правая часть — имя и меню */}
//       <View style={styles.rightContent}>
//         <View style={styles.nameRow}>
//           <Text style={styles.name}>{name}</Text>
//           <TouchableOpacity onPress={() => setMenuOpen(true)}>
//             <Text style={styles.menuText}>⋯</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Всплывающее меню */}
//       <Modal
//         transparent
//         animationType="fade"
//         visible={menuOpen}
//         onRequestClose={() => setMenuOpen(false)}
//       >
//         <Pressable style={styles.modalOverlay} onPress={() => setMenuOpen(false)}>
//           <View style={styles.menuContainer}>
//             <TouchableOpacity style={styles.menuItem}>
//               <Text>✏️ Изменить</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.menuItem}>
//               <Text style={{ color: "red" }}>🗑️ Удалить</Text>
//             </TouchableOpacity>
//           </View>
//         </Pressable>
//       </Modal>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 16,
    width: "100%",
    height: 160,
  },
  image: {
    width: "50%",
    height: "100%",
    resizeMode: "cover",
  },
  rightContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
  },
  menuText: {
    fontSize: 24,
    color: "#555",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: 180,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItem: {
    paddingVertical: 10,
  },
});
