import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { db } from '@/firebaseConfig';
import { addDoc, collection, DocumentData, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { usePetContext } from '../../context/formContext';

const storage = getStorage();


export default function PDFUploader() {
  const [files, setFiles] = useState<DocumentData[]>([]);
  const {user, selectedPetId} = usePetContext(); 

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
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.canceled || !result.assets?.length || !user) {
        console.warn("📄 Файл не выбран или пользователь не авторизован");
        return;
      }

      const file = result.assets[0];
      const { uri, name } = file;
      console.log("📂 Выбран файл:", name, uri);

      let blob: Blob;

      try {
        if (uri.startsWith("file://")) {
          // iOS
          const response = await fetch(uri);
          blob = await response.blob();
        } else {
          // Android content://
          const fileInfo = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          blob = new Blob([Uint8Array.from(atob(fileInfo), c => c.charCodeAt(0))], { type: 'application/pdf' });
        }
      } catch (err) {
        console.error("❌ Ошибка при конвертации файла в Blob:", err);
        return;
      }

      const storageRef = ref(storage, `users/${user.uid}/pets/${selectedPetId}/documents/${name}`);

      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      if (!user?.uid || !selectedPetId) {
        console.warn("⚠ User ID или выбранный питомец отсутствует");
        return;
      }

      try {
        const docRef = await addDoc(
          collection(db, "users", user.uid, "pets", selectedPetId, "documents"),
          {
            name,
            url: downloadUrl,
            createdAt: new Date(),
          }
        );
        console.log("✅ Документ добавлен в Firestore, ID:", docRef.id);
      } catch (error) {
        console.error("❌ Ошибка при добавлении документа в Firestore:", error);
      }

      setFiles(prev => [...prev, { name, url: downloadUrl }]);
    } catch (error) {
      console.error("Ошибка Firebase Storage:", JSON.stringify(error, null, 2));
    }
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
