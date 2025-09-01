import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Button,
  View,
  Text,
} from 'react-native';
import ProductCard from './ProductCard';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        // สร้าง stock สุ่มสำหรับตัวอย่าง
        const mapped = data.map((item, index) => ({
          id: String(item.id),
          name: item.title,
          price: String(item.price),
          stock: index % 5 === 0 ? "0" : "10",
          cate: item.category,
          pic: item.image,
        }));
        setProducts(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts =
    filter === "IN_STOCK"
      ? products.filter(p => parseInt(p.stock) > 0)
      : products;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="All" onPress={() => setFilter("ALL")} />
        <Button title="IN STOCK" onPress={() => setFilter("IN_STOCK")} />
      </View>

      <Text style={styles.countText}>แสดง {filteredProducts.length} รายการ</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e91e63" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              price={product.price}
              description={product.cate}
              image={product.pic}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: StatusBar.currentHeight },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  countText: { textAlign: "center", marginBottom: 10, fontSize: 16 },
});

export default App;
