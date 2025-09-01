import BottomMenu from '@/components/BottomMenu';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PetFile, usePetContext } from '../../context/formContext';

export default function FileUploader() {
  const { selectedPetId, files, fetchFiles, addFile, deleteFile } = usePetContext();

  useEffect(() => {
    if (selectedPetId) {
      fetchFiles(selectedPetId);
    }
  }, [selectedPetId]);

  const pickFile = async () => {
    if (!selectedPetId) {
      alert("Сначала выберите питомца");
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

    if (result.type === 'success') {
      // Теперь TypeScript точно знает, что result — DocumentPickerSuccessResult
      const fileData = {
        name: result.name,
        uri: result.uri,
        size: result.size, // может быть undefined
      };

      await addFile(selectedPetId, fileData);
    } else {
      console.warn("Файл не выбран");
    }
  };

  const shareFile = async (file: PetFile) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        alert("Шеринг не поддерживается на этом устройстве");
        return;
      }
      await Sharing.shareAsync(file.uri);
    } catch (error: any) {
      alert("Ошибка при попытке поделиться: " + error.message);
    }
  };

  const removeFile = async (fileId: string) => {
    await deleteFile(fileId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Документы</Text>
      <ScrollView style={{ flex: 1 }}>
        {(!files || files.length === 0) && <Text style={styles.noFilesText}>Файлы не выбраны</Text>}

        {files.map((file) => (
          <View key={file.id} style={styles.card}>
            <MaterialIcons name="insert-drive-file" size={32} color="#607d8b" style={{ marginRight: 10 }} />
            <View style={styles.cardContent}>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.date}>
                {new Date(file.created_at).toLocaleDateString()} {new Date(file.created_at).toLocaleTimeString()}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => shareFile(file)} style={styles.actionButton}>
                <MaterialIcons name="share" size={24} color="#00796b" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFile(file.id)} style={[styles.actionButton, { marginLeft: 8 }]}>
                <MaterialIcons name="delete" size={24} color="#d32f2f" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={pickFile} activeOpacity={0.7}>
        <MaterialIcons name="add" size={28} color="#fff" />
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
    marginTop: 16,
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
