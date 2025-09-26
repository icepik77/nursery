import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  onBack?: () => void;
  icon?: 'back' | 'check'; // ← можно выбрать тип иконки
};

export default function CustomHeader({ title, onBack, icon = 'back' }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack ?? (() => router.back())}
        hitSlop={10}
      >
        {icon === 'back' ? (
          <Ionicons name="chevron-back" size={28} color="#333" />
        ) : (
          <Ionicons name="checkmark" size={28} color="#333" />
        )}
      </TouchableOpacity>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      {/* Пустой блок справа, чтобы заголовок оставался по центру */}
      <View style={styles.rightSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',        // ⬅️ Центровка по вертикали
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#f4f6f8",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  rightSpacer: {
    width: 40,
  },
});
