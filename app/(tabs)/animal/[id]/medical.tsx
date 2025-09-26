import BottomMenu from '@/components/BottomMenu';
import CustomHeader from '@/components/CustomHeader';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MedicalCategory, usePetContext } from '../../context/formContext';


// Объект для отображаемых названий
export const CATEGORY_LABELS = {
  vaccination: 'Прививки',
  treatment: 'Дегельминтизация',
  surgery: 'Клещи',
  other: 'Аллергии',
} as const;

const LABEL_TO_CATEGORY: Record<string, MedicalCategory> = {
  Прививки: 'vaccination',
  Дегельминтизация: 'treatment',
  Клещи: 'surgery',
  Аллергии: 'other',
};

// Тип ключей объекта CATEGORY_LABELS
export type MedicalCategoryKey = keyof typeof CATEGORY_LABELS;

// Массив для вкладок UI
export const CATEGORIES = Object.values(CATEGORY_LABELS);
type Category = typeof CATEGORIES[number];

export default function NotesScreen() {
  const { selectedPetId, medical, fetchMedical, addMedical, updateMedical, deleteMedical } = usePetContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Прививки');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('Прививки');

  useEffect(() => {
    console.log("selectedPetIdMedical", selectedPetId); 
    if (selectedPetId) fetchMedical(selectedPetId);
  }, [selectedPetId]);

  const openAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategory(selectedCategory);
    setModalVisible(true);
  };

  const openEditModal = (noteId: string) => {
    const note = medical.find(n => n.id === noteId);
    if (!note) return;
    setEditingNote(note.id);
    setTitle(note.title || '');
    setContent(note.content || '');
    setCategory((note.category as Category) || selectedCategory);
    setModalVisible(true);
  };

  const saveNote = async () => {
    if (!selectedPetId) return;
    const data = {
      title,
      content,
      category: LABEL_TO_CATEGORY[category], // enum для базы
    };

    if (editingNote) {
      await updateMedical(editingNote, data);
    } else {
      await addMedical(selectedPetId, data);
    }

    setModalVisible(false);
    setEditingNote(null);
    setTitle('');
    setContent('');
  };

  const removeNote = async () => {
    if (!editingNote) return;
    await deleteMedical(editingNote);
    setModalVisible(false);
    setEditingNote(null);
  };

  const filteredNotes = medical.filter(
    n => CATEGORY_LABELS[n.category] === selectedCategory
  );

  return (
    <>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView style={styles.container}>
          {/* <Text style={styles.title}>Заметки для питомца</Text> */}
          <CustomHeader title="Заметки для питомца"/>

          {/* Выбор категории */}
          <View style={styles.tabContainer}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.tab,
                  cat === selectedCategory && styles.activeTab
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={cat === selectedCategory ? styles.activeTabText : styles.tabText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView>
            {filteredNotes.length === 0 ? (
              <Text style={styles.emptyText}>Нет заметок</Text>
            ) : (
              filteredNotes.map(note => (
                <TouchableOpacity
                  key={note.id}
                  style={styles.noteCard}
                  onPress={() => openEditModal(note.id)}
                >
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  {note.content ? <Text style={styles.noteContent}>{note.content}</Text> : null}
                  <Text style={styles.noteDate}>
                    {new Date(note.created_at).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
            <MaterialIcons name="add-circle" size={56} color="#00796b" />
          </TouchableOpacity>

          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {editingNote ? 'Редактировать заметку' : 'Добавить заметку'}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Заголовок"
                  value={title}
                  onChangeText={setTitle}
                />

                <TextInput
                  style={[styles.input, { height: 80 }]}
                  placeholder="Текст заметки"
                  value={content}
                  onChangeText={setContent}
                  multiline
                />

                {/* Выбор категории при добавлении/редактировании */}
                <View style={styles.tabContainer}>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.tab,
                        cat === category && styles.activeTab
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={cat === category ? styles.activeTabText : styles.tabText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  {editingNote && (
                    <TouchableOpacity style={styles.deleteBtn} onPress={removeNote}>
                      <Text style={styles.deleteText}>Удалить</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelText}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
                    <Text style={styles.saveText}>
                      {editingNote ? 'Сохранить' : 'Добавить'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <BottomMenu />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 0},
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', marginTop: 16 },
  tabContainer: { flexDirection: 'row', marginBottom: 10 },
  tab: { flex: 1, paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#00796b' },
  tabText: { textAlign: 'center', color: '#555' },
  activeTabText: { textAlign: 'center', color: '#00796b', fontWeight: '700' },
  emptyText: { color: '#999', marginTop: 20, textAlign: 'center' },
  noteCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  noteTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  noteContent: { fontSize: 14, color: '#555', marginTop: 5 },
  noteDate: { fontSize: 12, color: '#999', marginTop: 10 },
  addBtn: { position: 'absolute', bottom: 90, right: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  cancelBtn: { marginRight: 10, marginTop: 8 },
  cancelText: { color: '#999', fontSize: 16 },
  saveBtn: { backgroundColor: '#00796b', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 8 },
  saveText: { color: '#fff', fontSize: 16 },
  deleteBtn: { marginRight: 'auto', marginTop: 10 },
  deleteText: { color: '#d32f2f', fontSize: 16, fontWeight: '600' },
});
