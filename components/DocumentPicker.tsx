import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { Button, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PDFUploader() {
  const [files, setFiles] = useState([]);

  const pickPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setFiles((prevFiles) => [...prevFiles, file]);
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

        {files.map((file, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <Text>{file.name}</Text>
            <TouchableOpacity onPress={() => openPDF(file.uri)}>
              <Text style={{ color: 'blue', marginTop: 5 }}>Открыть PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sharePDF(file.uri)}>
              <Text style={{ color: 'green', marginTop: 5 }}>Поделиться</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
