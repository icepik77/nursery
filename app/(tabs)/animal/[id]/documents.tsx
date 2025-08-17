import BottomMenu from '@/components/BottomMenu';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePetContext } from '../../context/formContext';

type MockFile = {
  name: string;
  uri: string;
  createdAt: Date;
};

export default function PDFUploader() {
  const [files, setFiles] = useState<MockFile[]>([]);
  const { selectedPetId } = usePetContext();

  useEffect(() => {
    if (!selectedPetId) setFiles([]);
  }, [selectedPetId]);

  const pickPDF = async () => {
    if (!selectedPetId) {
      alert("Сначала выберите питомца");
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

    if (result.canceled) {
      console.warn("Файл не выбран");
      return;
    }

    const file = result.assets[0];
    const uri = file.uri;
    const name = file.name || uri.split('/').pop() || 'unknown.pdf';

    if (!uri) {
      console.warn("Не удалось получить uri файла");
      return;
    }

    setFiles(prev => [...prev, { name, uri, createdAt: new Date() }]);
  };

  const sharePDF = async (uri: string) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        alert("Шеринг не поддерживается на этом устройстве");
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (error: any) {
      alert("Ошибка при попытке поделиться: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Профиль питомца</Text>
      <ScrollView style={{ flex: 1 }}>
        {files.length === 0 && <Text style={styles.noFilesText}>Файлы не выбраны</Text>}

        {files.map((file, index) => (
          <View key={index} style={styles.card}>
            <MaterialIcons name="picture-as-pdf" size={32} color="#e53935" style={{ marginRight: 10 }} />
            <View style={styles.cardContent}>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.date}>
                {file.createdAt.toLocaleDateString()} {file.createdAt.toLocaleTimeString()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => sharePDF(file.uri)} style={styles.actionButton}>
              <MaterialIcons name="share" size={24} color="#00796b" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={pickPDF} activeOpacity={0.7}>
        <MaterialIcons name="picture-as-pdf" size={28} color="#fff" />
      </TouchableOpacity>
      <BottomMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  noFilesText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 40,
    backgroundColor: '#00796b',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
});
