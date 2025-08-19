import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ProductCard from './components/ProductCard';

export default function App() {
  const products = [
    { title: 'Product', price: '999$', imageUrl: 'https://legacy.reactjs.org/logo-og.png' },
    { title: 'Product', price: '999$', imageUrl: 'https://legacy.reactjs.org/logo-og.png' },
    { title: 'Product', price: '999$', imageUrl: 'https://legacy.reactjs.org/logo-og.png' },
    { title: 'Product', price: '999$', imageUrl: 'https://legacy.reactjs.org/logo-og.png' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {products.map((item, index) => (
        <ProductCard
          key={index}
          title={item.title}
          price={item.price}
          imageUrl={item.imageUrl}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start', // <-- ชิดซ้าย
    paddingVertical: 20,
    paddingLeft: 10, // เว้นขอบซ้ายเล็กน้อย
  },
});
