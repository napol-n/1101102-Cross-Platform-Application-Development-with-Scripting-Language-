import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function ProductCard({ title, price, imageUrl }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    width: 200,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#ff4d4d',
    marginTop: 5,
  },
});
