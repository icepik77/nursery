import BottomMenu from '@/components/BottomMenu';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type MedicalRecord = {
  id: string;
  date: Date;
  type: string;
  details?: string;
};

export default function MedicalInfoScreen() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('');
  const [details, setDetails] = useState('');
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);

  const [records, setRecords] = useState<{ [key: string]: MedicalRecord[] }>({
    vaccines: [],
    deworming: [],
    ticks: [],
    illnesses: [],
    allergies: [],
  });

  const openAddModal = (section: string) => {
    setActiveSection(section);
    setEditingRecord(null); // новый режим
    setDate(new Date());
    setType('');
    setDetails('');
    setModalVisible(true);
  };

  const openEditModal = (section: string, record: MedicalRecord) => {
    setActiveSection(section);
    setEditingRecord(record);
    setDate(record.date);
    setType(record.type);
    setDetails(record.details || '');
    setModalVisible(true);
  };

  const saveRecord = () => {
    if (!activeSection) return;

    if (editingRecord) {
      // обновляем запись
      setRecords(prev => ({
        ...prev,
        [activeSection]: prev[activeSection].map(r =>
          r.id === editingRecord.id ? { ...r, date, type, details } : r
        ),
      }));
    } else {
      // создаём новую
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        date,
        type,
        details,
      };
      setRecords(prev => ({
        ...prev,
        [activeSection]: [...prev[activeSection], newRecord],
      }));
    }

    setModalVisible(false);
    setEditingRecord(null);
  };

  const deleteRecord = () => {
    if (!activeSection || !editingRecord) return;
    setRecords(prev => ({
      ...prev,
      [activeSection]: prev[activeSection].filter(r => r.id !== editingRecord.id),
    }));
    setModalVisible(false);
    setEditingRecord(null);
  };

  const renderSection = (title: string, sectionKey: keyof typeof records) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => openAddModal(String(sectionKey))}>
          <MaterialIcons name="add-circle" size={28} color="#00796b" />
        </TouchableOpacity>
      </View>
      {records[sectionKey].length === 0 ? (
        <Text style={styles.emptyText}>Нет данных</Text>
      ) : (
        records[sectionKey].map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.record}
            onPress={() => openEditModal(String(sectionKey), item)}
          >
            <Text style={styles.recordText}>
              {item.date.toLocaleDateString()} — {item.type}
            </Text>
            {item.details ? <Text style={styles.recordDetails}>{item.details}</Text> : null}
          </TouchableOpacity>
        ))
      )}
    </View>
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Медицина</Text>
          <ScrollView>
            {renderSection('Вакцинации', 'vaccines')}
            {renderSection('Дегельминтизация', 'deworming')}
            {renderSection('Клещи', 'ticks')}
            {renderSection('Болезни и операции', 'illnesses')}
            {renderSection('Аллергии', 'allergies')}
          </ScrollView>

          {/* Модалка добавления/редактирования */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {editingRecord ? 'Редактировать запись' : 'Добавить запись'}
                </Text>

                {/* Дата */}
                <TouchableOpacity 
                  style={styles.input} 
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{date.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) setDate(selectedDate);
                    }}
                  />
                )}

                {/* Тип */}
                <TextInput
                  style={styles.input}
                  placeholder="Тип (например: вакцина от бешенства)"
                  value={type}
                  onChangeText={setType}
                />

                {/* Детали */}
                <TextInput
                  style={[styles.input, { height: 60 }]}
                  placeholder="Комментарий / детали"
                  value={details}
                  onChangeText={setDetails}
                  multiline
                />

                <View style={styles.modalActions}>
                  {editingRecord && (
                    <TouchableOpacity style={styles.deleteBtn} onPress={deleteRecord}>
                      <Text style={styles.deleteText}>Удалить</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelText}>Отмена</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveRecord}>
                    <Text style={styles.saveText}>{editingRecord ? 'Сохранить' : 'Добавить'}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
    marginTop:20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    marginTop: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    color: '#999',
    marginTop: 10,
  },
  record: {
    marginTop: 10,
  },
  recordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  recordDetails: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  cancelBtn: {
    marginRight: 10,
    marginTop: 8,
  },
  cancelText: {
    color: '#999',
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#00796b',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteBtn: {
    marginRight: 'auto',
    marginTop: 10,
  },
  deleteText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '600',
  },
});
