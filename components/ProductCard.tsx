import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

type ProductCardProps = {
  product: Product;
  onBuy: (product: Product) => void;
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 45) / 2; // 2 колонки с отступами

export default function ProductCard({ product, onBuy }: ProductCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.9}
      onPress={() => router.push(`/(tabs)/shop/product/${product.id}`)}
    >
      <Image
        source={
          product.image
            ? { uri: product.image }
            : require("@/assets/images/product-avatar.png") // путь к дефолтной картинке
        }
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.productName} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {product.description}
      </Text>
      <Text style={styles.price}>{product.price} ₽</Text>

      {/* Кнопка "Купить" */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // чтобы не срабатывал переход при нажатии на кнопку
          onBuy(product);
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Купить</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginHorizontal: 5,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#00796b',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#00796b',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
