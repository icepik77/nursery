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
import { usePetContext } from '../../context/formContext';

export default function PetNotesScreen() {
  const { selectedPetId, notes, fetchNotes, addNote, updateNote, deleteNote } = usePetContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPetId) {
      fetchNotes(selectedPetId);
    }
  }, [selectedPetId]);

  const openAddModal = () => {
    setNoteText('');
    setEditingNoteId(null);
    setModalVisible(true);
  };

  const openEditModal = (noteId: string, text: string) => {
    setNoteText(text);
    setEditingNoteId(noteId);
    setModalVisible(true);
  };

  const saveNote = async () => {
    if (!selectedPetId || noteText.trim() === '') return;

    if (editingNoteId) {
      await updateNote(editingNoteId, noteText.trim());
    } else {
      await addNote(selectedPetId, noteText.trim());
    }

    setModalVisible(false);
    setEditingNoteId(null);
    setNoteText('');
  };

  const removeNote = async () => {
    if (!editingNoteId) return;
    await deleteNote(editingNoteId);
    setModalVisible(false);
    setEditingNoteId(null);
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.container}>
          <CustomHeader title="Заметки для питомца"/>
          {/* <Text style={styles.title}>Заметки о питомце</Text> */}
          <ScrollView>
            {notes.length === 0 ? (
              <Text style={styles.emptyText}>Заметок пока нет</Text>
            ) : (
              notes.map(note => (
                <TouchableOpacity
                  key={note.id}
                  style={styles.noteCard}
                  onPress={() => openEditModal(note.id, note.text)}
                >
                  <Text style={styles.noteText}>{note.text}</Text>
                  <Text style={styles.noteDate}>
                    {new Date(note.created_at).toLocaleDateString()}{' '}
                    {new Date(note.created_at).toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <TouchableOpacity style={styles.fab} onPress={openAddModal}>
            <MaterialIcons name="add" size={32} color="#fff" />
          </TouchableOpacity>

          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {editingNoteId ? 'Редактировать заметку' : 'Новая заметка'}
                </Text>

                <TextInput
                  style={[styles.input, { height: 120 }]}
                  placeholder="Введите текст заметки"
                  value={noteText}
                  onChangeText={setNoteText}
                  multiline
                />

                <View style={styles.modalActions}>
                  {editingNoteId && (
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
                      {editingNoteId ? 'Сохранить' : 'Добавить'}
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
  container: { flex: 1, backgroundColor: '#f4f6f8', padding: 20, marginTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', marginTop: 16 },
  emptyText: { color: '#999', textAlign: 'center', marginTop: 50, fontSize: 16 },
  noteCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  noteText: { fontSize: 16, color: '#333' },
  noteDate: { fontSize: 12, color: '#666', marginTop: 6 },
  fab: { position: 'absolute', bottom: 100, right: 20, backgroundColor: '#00796b', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  input: { backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10, fontSize: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
  cancelBtn: { marginRight: 10, marginTop: 8 },
  cancelText: { color: '#999', fontSize: 16 },
  saveBtn: { backgroundColor: '#00796b', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 8 },
  saveText: { color: '#fff', fontSize: 16 },
  deleteBtn: { marginRight: 'auto', marginTop: 10 },
  deleteText: { color: '#d32f2f', fontSize: 16, fontWeight: '600' },
});
