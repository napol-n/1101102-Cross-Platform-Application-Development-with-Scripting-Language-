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

const AppSUTAPI = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL | IN_STOCK

  // ดึงข้อมูลจาก SUT API หลายหน้า
  const fetchAllPages = async () => {
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await fetch(`http://it2.sut.ac.th/labexample/product.php?pageno=${page}`);
        const data = await response.json();

        if (!data || data.length === 0) {
          hasMore = false;
        } else {
          allProducts = [...allProducts, ...data];
          page += 1;
        }
      }

      console.log("จำนวนสินค้าทั้งหมด:", allProducts.length);
      setProducts(allProducts);
    } catch (error) {
      console.error("❌ โหลด SUT API ไม่ได้:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPages();
  }, []);

  // filter สินค้า
  const filteredProducts =
    filter === "IN_STOCK"
      ? products.filter((p) => parseInt(p.stock) > 0)
      : products;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="All" onPress={() => setFilter("ALL")} />
        <Button title="IN STOCK" onPress={() => setFilter("IN_STOCK")} />
      </View>

      <Text style={styles.countText}>
        แสดง {filteredProducts.length} รายการ
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#e91e63" style={{ marginTop: 20 }} />
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.noData}>ไม่มีสินค้า</Text>
      ) : (
        <ScrollView>
          {filteredProducts.map((product) => (
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
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#f5f5f5",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  countText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default AppSUTAPI;
