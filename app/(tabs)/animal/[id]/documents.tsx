import BottomMenu from '@/components/BottomMenu';
import CustomHeader from '@/components/CustomHeader';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import React, { useEffect } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PetFile, usePetContext } from '../../context/formContext';

export default function FileUploader() {
  const { selectedPetId, files, fetchFiles, addFile, deleteFile } = usePetContext();

  useEffect(() => {
    if (selectedPetId) fetchFiles(selectedPetId);
  }, [selectedPetId]);

  const pickFile = async () => {
    if (!selectedPetId) {
      alert("Сначала выберите питомца");
      return;
    }

    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) {
      const asset = result.assets[0];
      const safeName = encodeURIComponent(asset.name);

      const fileData = {
        name: safeName,
        uri: asset.uri,
        type: asset.mimeType || "application/octet-stream",
        size: asset.size,
      };

      await addFile(selectedPetId, fileData);
    } else {
      console.warn("Файл не выбран");
    }
  };

 const downloadAndShare = async (file: PetFile) => {
  try {
    if (Platform.OS === 'web') {
      alert("Скачивание файлов доступно только на мобильных устройствах");
      return;
    }

    if (!file.uri.startsWith('file://') && file.uri.startsWith('http')) {
      const dir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
      if (!dir) throw new Error("Не удалось получить доступ к локальной директории");

      const fileUri = dir + encodeURIComponent(file.name);
      const { uri } = await FileSystem.downloadAsync(file.uri, fileUri);
      await Sharing.shareAsync(uri);
    } else {
      // локальный файл
      await Sharing.shareAsync(file.uri);
    }
  } catch (e: any) {
    alert("Ошибка при скачивании/шеринге: " + e.message);
  }
};

  const removeFile = async (fileId: string) => {
    await deleteFile(fileId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Документы"/>
      <ScrollView style={{ flex: 1 }}>
        {(!files || files.length === 0) && (
          <Text style={styles.noFilesText}>Файлы не выбраны</Text>
        )}

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
              <TouchableOpacity onPress={() => downloadAndShare(file)} style={styles.actionButton}>
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
  container: { flex: 1, backgroundColor: '#f4f6f8', paddingHorizontal: 20, paddingTop: 0 },
  noFilesText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
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
  cardContent: { flex: 1 },
  fileName: { fontSize: 16, fontWeight: '600', color: '#333' },
  date: { fontSize: 12, color: '#666', marginTop: 3 },
  actionButton: { padding: 8, backgroundColor: '#e0f7fa', borderRadius: 8 },
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
