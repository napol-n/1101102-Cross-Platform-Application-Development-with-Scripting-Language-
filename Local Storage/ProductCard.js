import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProductCard({ title, price, description, image, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {image ? (
        <Image source={{ uri: image }} style={styles.img} />
      ) : (
        <View style={[styles.img, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>ไม่มีรูป</Text>
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
      <Text style={styles.price}>ราคา: {price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  img: { width: '100%', height: 150, resizeMode: 'contain', borderRadius: 5, marginBottom: 10 },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  desc: { color: '#555', marginBottom: 4 },
  price: { color: '#e91e63', fontWeight: 'bold' },
});
