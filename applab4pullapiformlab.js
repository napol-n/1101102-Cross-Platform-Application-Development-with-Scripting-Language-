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
  const [filter, setFilter] = useState("ALL"); // ALL | IN_STOCK

  // ฟังก์ชันดึงข้อมูลจาก SUT API (pagination)
  const fetchSUTAPI = async () => {
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const res = await fetch(`http://it2.sut.ac.th/labexample/product.php?pageno=${page}`);
        const text = await res.text();
        const data = JSON.parse(text);

        if (!data || data.length === 0) {
          hasMore = false;
        } else {
          allProducts = [...allProducts, ...data];
          page++;
        }
      }

      if (allProducts.length === 0) throw new Error("ไม่มีข้อมูลจาก SUT API");

      return allProducts.map(item => ({
        id: String(item.id),
        name: item.name,
        price: String(item.price),
        stock: String(item.stock),
        cate: item.cate,
        pic: item.pic,
      }));
    } catch (err) {
      console.warn("⚠️ SUT API ไม่ได้ผล, fallback ไป FakeStoreAPI");
      return null;
    }
  };

  // ฟังก์ชัน fallback FakeStoreAPI
  const fetchFakeStore = async () => {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      return data.map((item, index) => ({
        id: String(item.id),
        name: item.title,
        price: String(item.price),
        stock: index % 5 === 0 ? "0" : "10", // สุ่ม stock หมดบางรายการ
        cate: item.category,
        pic: item.image,
      }));
    } catch (err) {
      console.error("❌ โหลด FakeStoreAPI ไม่ได้:", err);
      return [];
    }
  };

  // ดึงข้อมูลทั้งหมด
  const fetchProducts = async () => {
    setLoading(true);
    let data = await fetchSUTAPI();
    if (!data) {
      data = await fetchFakeStore();
    }
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // filter สินค้า
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
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.noData}>ไม่มีสินค้า</Text>
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
  container: { flex: 1, paddingTop: StatusBar.currentHeight, backgroundColor: "#f5f5f5" },
  buttonRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  countText: { textAlign: "center", marginBottom: 10, fontSize: 16, color: "#333" },
  noData: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
});

export default App;
