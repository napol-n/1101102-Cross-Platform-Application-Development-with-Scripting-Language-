import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, StyleSheet, ActivityIndicator, Button, View, Text } from 'react-native';
import ProductCard from '../ProductCard';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setProducts(data.map((item,index) => ({
        id: String(item.id),
        name: item.title,
        price: String(item.price),
        stock: index % 5 === 0 ? "0" : "10",
        cate: item.category,
        pic: item.image
      })));
    } catch (err) {
      console.error("❌ โหลด FakeStoreAPI ไม่ได้:", err);
      setProducts([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filteredProducts = filter === "IN_STOCK" ? products.filter(p => parseInt(p.stock) > 0) : products;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="All" onPress={() => setFilter("ALL")} />
        <Button title="IN STOCK" onPress={() => setFilter("IN_STOCK")} />
      </View>

      <Text style={styles.countText}>แสดง {filteredProducts.length} รายการ</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e91e63" style={{ marginTop: 20 }} />
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.noData}>ไม่มีสินค้า</Text>
      ) : (
        <ScrollView>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} title={product.name} price={product.price} description={product.cate} image={product.pic} stock={product.stock} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  countText: { textAlign: "center", marginBottom: 10, fontSize: 16, color: "#333" },
  noData: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
});
