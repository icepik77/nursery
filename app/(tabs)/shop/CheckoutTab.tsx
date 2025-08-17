import BottomMenu from '@/components/BottomMenu';
import React, { useState } from 'react';
import { Alert, Button, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { useCart } from "../context/cartContext";

export default function CheckoutTab() {
  const { cart, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  const total = cart.reduce((sum, item) => sum + item.price, 0); // 👈 у тебя нет количества, так что просто сумма

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11; // Россия: +7XXXXXXXXXX
  };

  const placeOrder = () => {
    if (!name || !phone || !street || !house || !city) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert('Ошибка', 'Введите корректный номер телефона');
      return;
    }

    const fullAddress = `${street}, д. ${house}${apartment ? ', кв. ' + apartment : ''}, г. ${city}`;

    console.log('Заказ оформлен', { name, phone, address: fullAddress, paymentMethod, cart });
    Alert.alert('Успех', `Заказ успешно оформлен на сумму ${total} ₽!`);

    clearCart(); // очищаем корзину после успешного оформления
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }} style={styles.container}>
          <Text style={styles.header}>Ваш заказ</Text>

          {cart.map(item => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price} ₽</Text>
            </View>
          ))}

          <Text style={styles.total}>Итого: {total} ₽</Text>

          <Text style={styles.sectionHeader}>Данные покупателя</Text>
          <TextInput
            placeholder="Имя"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <MaskInput
            value={phone}
            onChangeText={setPhone}
            mask={['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholder="+7 (___) ___-____"
            style={styles.input}
            keyboardType="phone-pad"
          />

          <Text style={styles.sectionHeader}>Адрес доставки</Text>
          <TextInput
            placeholder="Улица"
            value={street}
            onChangeText={setStreet}
            style={styles.input}
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput
              placeholder="Дом"
              value={house}
              onChangeText={setHouse}
              style={[styles.input, { flex: 1 }]}
            />
            <TextInput
              placeholder="Квартира"
              value={apartment}
              onChangeText={setApartment}
              style={[styles.input, { flex: 1 }]}
            />
          </View>
          <TextInput
            placeholder="Город"
            value={city}
            onChangeText={setCity}
            style={styles.input}
          />

          <Text style={styles.sectionHeader}>Способ оплаты</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity onPress={() => setPaymentMethod('card')} style={paymentMethod === 'card' ? styles.selectedOption : styles.option}>
              <Text style={paymentMethod === 'card' ? { color: '#fff' } : {}}>Карта</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPaymentMethod('cash')} style={paymentMethod === 'cash' ? styles.selectedOption : styles.option}>
              <Text style={paymentMethod === 'cash' ? { color: '#fff' } : {}}>Наличные</Text>
            </TouchableOpacity>
          </View>

          <Button title="Оформить заказ" onPress={placeOrder} />
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomMenu />
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9f9f9', flex: 1 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  item: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, backgroundColor: '#fff', padding: 10, borderRadius: 8 },
  itemName: { fontSize: 16 },
  itemPrice: { fontSize: 16, fontWeight: 'bold' },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  sectionHeader: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  paymentOptions: { flexDirection: 'row', marginBottom: 20 },
  option: { flex: 1, padding: 10, backgroundColor: '#eee', alignItems: 'center', borderRadius: 8, marginRight: 10 },
  selectedOption: { flex: 1, padding: 10, backgroundColor: '#00796b', alignItems: 'center', borderRadius: 8, marginRight: 10 }
});
