import BottomMenu from '@/components/BottomMenu';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [records, setRecords] = useState<{ [key: string]: MedicalRecord[] }>({
    vaccines: [],
    parasites: [],
    illnesses: [],
    allergies: [],
  });

  const openAddModal = (section: string) => {
    setActiveSection(section);
    setModalVisible(true);
  };

  const addRecord = () => {
    if (!activeSection) return;
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
    setType('');
    setDetails('');
    setModalVisible(false);
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
          <View key={item.id} style={styles.record}>
            <Text style={styles.recordText}>
              {item.date.toLocaleDateString()} — {item.type}
            </Text>
            {item.details ? <Text style={styles.recordDetails}>{item.details}</Text> : null}
          </View>
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Медицина</Text>
      <ScrollView>
        {renderSection('Вакцинации', 'vaccines')}
        {renderSection('Обработка от паразитов', 'parasites')}
        {renderSection('Болезни и операции', 'illnesses')}
        {renderSection('Аллергии', 'allergies')}
      </ScrollView>

      {/* Модальное окно для добавления */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить запись</Text>

            {/* Дата */}
            {/* Кнопка для выбора даты */}
            <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowDatePicker(true)}
            >
            <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {/* Отдельный вызов пикера */}
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
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={addRecord}>
                <Text style={styles.saveText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
    marginTop:20,
  },
  headerText: { fontSize: 28, fontWeight: "bold", marginBottom: 12, marginTop:14 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
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
});
