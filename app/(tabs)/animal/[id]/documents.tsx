import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { db } from '@/firebaseConfig';
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { usePetContext } from '../../context/formContext';

const storage = getStorage();


export default function PDFUploader() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
  if (!user || !selectedPetId) return;

  const loadDocuments = async () => {
    const docsCollection = collection(db, "users", user.uid, "pets", selectedPetId, "documents");
    const snapshot = await getDocs(docsCollection);

    const docsList = snapshot.docs.map(doc => doc.data());
    setFiles(docsList);
  };

  loadDocuments();
}, [user, selectedPetId]);

  const pickPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.type === "success") {
      const { uri, name } = result;

      // Конвертируем локальный URI в blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Создаём путь в Storage (пример)
      const storageRef = ref(storage, `users/${user.uid}/pets/${selectedPetId}/documents/${name}`);

      // Загружаем файл в Storage
      await uploadBytes(storageRef, blob);

      // Получаем публичный URL
      const downloadUrl = await getDownloadURL(storageRef);

      // Сохраняем метаданные в Firestore
      const docRef = await addDoc(
        collection(db, "users", user.uid, "pets", selectedPetId, "documents"),
        {
          name,
          url: downloadUrl,
          createdAt: new Date(),
        }
      );

      // Обновляем список файлов локально
      setFiles(prev => [...prev, { name, url: downloadUrl }]);
    }
  };

  const openPDF = (uri) => {
    Linking.openURL(uri);
  };

  const sharePDF = async (uri) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        alert('Шеринг не поддерживается на этом устройстве');
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (error) {
      alert('Ошибка при попытке поделиться: ' + error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Добавить PDF" onPress={pickPDF} />

      <ScrollView style={{ marginTop: 20 }}>
        {files.length === 0 && <Text>Файлы не выбраны</Text>}

        {files.length === 0 && <Text>Файлы не выбраны</Text>}

        {files.map((file, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <Text>{file.name}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(file.url)}>
              <Text style={{ color: 'blue', marginTop: 5 }}>Открыть PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sharePDF(file.url)}>
              <Text style={{ color: 'green', marginTop: 5 }}>Поделиться</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
