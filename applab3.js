import React from 'react';
import { ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';

const productData = [
  {
    id: '1',
    title: 'Pantene แพนทีน มิราเคิล คริสตัล สมูท แชมพู+ครีมนวดผม 500 มล.',
    price: '599',
    description: 'ผลิตภัณฑ์ดูแลผม',
    image: 'http://it2.sut.ac.th/labexample/pics/pantene.jpg',
  },
  {
    id: '2',
    title: 'ลอรีอัล ปารีส เอลแซฟ เอ็กซ์ตรอว์ดินารี่ ออยล์ 100 มล.',
    price: '259',
    description: 'ผลิตภัณฑ์ดูแลผม',
    image: 'http://it2.sut.ac.th/labexample/pics/elseve.jpg',
  },
  {
    id: '3',
    title: 'Microsoft Surface Pro 7 Laptop with Type Cover',
    price: '38900',
    description: 'Computer',
    image: 'http://it2.sut.ac.th/labexample/pics/surface.jpg',
  },
  {
    id: '4',
    title: 'Desktop PC DELL Optiplex 3080SFF-SNS38SF001',
    price: '14400',
    description: 'Computer',
    image: 'http://it2.sut.ac.th/labexample/pics/dell.jpg',
  },
  {
    id: '5',
    title: 'ซัมซุง ตู้เย็น 2 ประตู รุ่น RT20HAR1DSA/ST ขนาด 7.4 คิว',
    price: '6990',
    description: 'เครื่องใช้ไฟฟ้า',
    image: 'http://it2.sut.ac.th/labexample/pics/fridge.jpg',
  },
];

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {productData.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
            image={product.image}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
