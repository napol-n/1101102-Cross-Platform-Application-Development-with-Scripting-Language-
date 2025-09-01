Lab5 
ลายเซ็น1-2
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ ใช้ AsyncStorage
import ProductCard from "./ProductCard";

const API_URL = "https://fakestoreapi.com/products";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();

        // ✅ สุ่ม stock 0–17 ให้แต่ละสินค้า
        data = data.map((p) => ({
          ...p,
          stock: Math.floor(Math.random() * 17),
        }));

        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ ฟังก์ชันกดสินค้า: แสดง Alert + บันทึก Local Storage
  const onPressItem = async (item) => {
    const name = item.name || item.title || "สินค้า";
    const detail = item.detail || item.description || "";
    const msg = `${name}${detail ? `\n\n${detail}` : ""}`;

    try {
      const prev = await AsyncStorage.getItem("selectedProducts");
      let list = prev ? JSON.parse(prev) : [];
      list.push(name);
      await AsyncStorage.setItem("selectedProducts", JSON.stringify(list));
    } catch (e) {
      console.error("Save error", e);
    }

    Alert.alert("Alert", `บันทึกแล้ว: ${msg}`);
  };

  // ✅ ฟังก์ชันเช็คข้อมูลที่บันทึกไว้
  const checkStorage = async () => {
    try {
      const data = await AsyncStorage.getItem("selectedProducts");
      const list = data ? JSON.parse(data) : [];
      Alert.alert("Saved Products", list.join("\n") || "ยังไม่มีข้อมูล");
    } catch (e) {
      console.error("Read error", e);
    }
  };

  const filteredItems =
    filter === "ALL" ? items : items.filter((p) => p.stock > 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "ALL" && styles.activeBtn]}
          onPress={() => setFilter("ALL")}
        >
          <Text style={styles.filterText}>ALL ({items.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === "IN STOCK" && styles.activeBtn]}
          onPress={() => setFilter("IN STOCK")}
        >
          <Text style={styles.filterText}>
            IN STOCK ({items.filter((p) => p.stock > 0).length})
          </Text>
        </TouchableOpacity>

        {/* ✅ ปุ่ม CHECK เพื่อดูสินค้าใน Local Storage */}
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: "#4CAF50" }]}
          onPress={checkStorage}
        >
          <Text style={styles.filterText}>CHECK</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>กำลังโหลดสินค้า...</Text>
        </View>
      ) : err ? (
        <View style={styles.center}>
          <Text style={styles.error}>เกิดข้อผิดพลาด: {err}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressItem(item)}
            >
              <ProductCard item={item} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { paddingVertical: 12 },
  error: { color: "tomato", fontWeight: "600" },

  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2196F3",
    paddingVertical: 12,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeBtn: {
    backgroundColor: "#1976D2",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


ลายเซ็น3
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCard from "./ProductCard";

const API_URL = "https://fakestoreapi.com/products";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState([]); // ✅ เก็บรายการที่ผู้ใช้เลือก

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();

        data = data.map((p) => ({
          ...p,
          stock: Math.floor(Math.random() * 17),
        }));

        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();

    // โหลดรายการที่บันทึกไว้ตอนเปิดแอป
    loadSelected();
  }, []);

  // ✅ โหลดข้อมูลจาก AsyncStorage
  const loadSelected = async () => {
    try {
      const data = await AsyncStorage.getItem("selectedProducts");
      const list = data ? JSON.parse(data) : [];
      setSelected(list);
    } catch (e) {
      console.error("Read error", e);
    }
  };

  // ✅ ฟังก์ชันกดสินค้า
  const onPressItem = async (item) => {
    const name = item.name || item.title || "สินค้า";
    const detail = item.detail || item.description || "";
    const msg = `${name}${detail ? `\n\n${detail}` : ""}`;

    try {
      const prev = await AsyncStorage.getItem("selectedProducts");
      let list = prev ? JSON.parse(prev) : [];
      list.push(name);
      await AsyncStorage.setItem("selectedProducts", JSON.stringify(list));
      setSelected(list); // อัปเดต state
    } catch (e) {
      console.error("Save error", e);
    }

    Alert.alert("Alert", `บันทึกแล้ว: ${msg}`);
  };

  // ✅ ล้างข้อมูล
  const clearSelected = async () => {
    try {
      await AsyncStorage.removeItem("selectedProducts");
      setSelected([]);
      Alert.alert("Alert", "ล้างรายการเรียบร้อยแล้ว");
    } catch (e) {
      console.error("Clear error", e);
    }
  };

  const filteredItems =
    filter === "ALL" ? items : items.filter((p) => p.stock > 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* ส่วนที่ 1: Filter */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "ALL" && styles.activeBtn]}
          onPress={() => setFilter("ALL")}
        >
          <Text style={styles.filterText}>ALL ({items.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === "IN STOCK" && styles.activeBtn]}
          onPress={() => setFilter("IN STOCK")}
        >
          <Text style={styles.filterText}>
            IN STOCK ({items.filter((p) => p.stock > 0).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* ส่วนที่ 2: แสดงสินค้า */}
      <View style={{ flex: 2 }}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 8 }}>กำลังโหลดสินค้า...</Text>
          </View>
        ) : err ? (
          <View style={styles.center}>
            <Text style={styles.error}>เกิดข้อผิดพลาด: {err}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPressItem(item)}
              >
                <ProductCard item={item} />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}
      </View>

      {/* ส่วนที่ 3: แสดงที่ผู้ใช้เลือก */}
      <View style={styles.selectedBox}>
        <View style={styles.selectedHeader}>
          <Text style={{ fontWeight: "bold" }}>เลือกแล้ว:</Text>
          <TouchableOpacity onPress={clearSelected}>
            <Text style={{ color: "red", fontWeight: "bold" }}>CLEAR</Text>
          </TouchableOpacity>
        </View>
        {selected.length === 0 ? (
          <Text style={{ color: "#777" }}>ยังไม่มีสินค้าเลือก</Text>
        ) : (
          selected.map((name, idx) => (
            <Text key={idx} style={{ marginTop: 2 }}>
              • {name}
            </Text>
          ))
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { paddingVertical: 12 },
  error: { color: "tomato", fontWeight: "600" },

  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2196F3",
    paddingVertical: 12,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeBtn: {
    backgroundColor: "#1976D2",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },

  selectedBox: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
});



ลายเซ็น1-4
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCard from "./ProductCard";

const API_URL = "https://fakestoreapi.com/products";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState([]); // ✅ เก็บสินค้าที่ผู้ใช้เลือก

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let data = await res.json();

        // ✅ เพิ่ม stock แบบสุ่ม
        data = data.map((p) => ({
          ...p,
          stock: Math.floor(Math.random() * 17),
        }));

        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(String(e?.message || e));
      } finally {
        setLoading(false);
      }
    })();

    // โหลดรายการจาก Local Storage ตอนเปิดแอป
    loadSelected();
  }, []);

  // ✅ โหลดข้อมูลที่เลือกไว้จาก AsyncStorage
  const loadSelected = async () => {
    try {
      const data = await AsyncStorage.getItem("selectedProducts");
      const list = data ? JSON.parse(data) : [];
      setSelected(list);
    } catch (e) {
      console.error("Read error", e);
    }
  };

  // ✅ ฟังก์ชันกดสินค้า → บันทึก + Alert
  const onPressItem = async (item) => {
    const name = item.name || item.title || "สินค้า";
    const detail = item.detail || item.description || "";
    const msg = `${name}${detail ? `\n\n${detail}` : ""}`;

    try {
      const prev = await AsyncStorage.getItem("selectedProducts");
      let list = prev ? JSON.parse(prev) : [];
      list.push(name);
      await AsyncStorage.setItem("selectedProducts", JSON.stringify(list));
      setSelected(list);
    } catch (e) {
      console.error("Save error", e);
    }

    Alert.alert("Alert", `บันทึกแล้ว: ${msg}`);
  };

  // ✅ ลบสินค้าทั้งหมดที่เลือกไว้
  const clearSelected = async () => {
    try {
      await AsyncStorage.removeItem("selectedProducts");
      setSelected([]);
      Alert.alert("Alert", "ตะกร้าสินค้าถูกลบแล้ว");
    } catch (e) {
      console.error("Clear error", e);
    }
  };

  // ✅ Filter
  const filteredItems =
    filter === "ALL" ? items : items.filter((p) => p.stock > 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* ส่วนที่ 1: ปุ่ม Filter */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "ALL" && styles.activeBtn]}
          onPress={() => setFilter("ALL")}
        >
          <Text style={styles.filterText}>ALL ({items.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, filter === "IN STOCK" && styles.activeBtn]}
          onPress={() => setFilter("IN STOCK")}
        >
          <Text style={styles.filterText}>
            IN STOCK ({items.filter((p) => p.stock > 0).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* ส่วนที่ 2: รายการสินค้า */}
      <View style={{ flex: 2 }}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 8 }}>กำลังโหลดสินค้า...</Text>
          </View>
        ) : err ? (
          <View style={styles.center}>
            <Text style={styles.error}>เกิดข้อผิดพลาด: {err}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPressItem(item)}
              >
                <ProductCard item={item} />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}
      </View>

      {/* ส่วนที่ 3: รายการที่เลือก */}
      <View style={styles.selectedBox}>
        <View style={styles.selectedHeader}>
          <Text style={{ fontWeight: "bold" }}>เลือกแล้ว:</Text>
          <TouchableOpacity onPress={clearSelected}>
            <Text style={{ color: "red", fontWeight: "bold" }}>CLEAR</Text>
          </TouchableOpacity>
        </View>

        {selected.length === 0 ? (
          <Text style={{ color: "#777" }}>ยังไม่มีสินค้าเลือก</Text>
        ) : (
          <ScrollView style={{ maxHeight: 120 }}>
            {selected.map((name, idx) => (
              <Text key={idx} style={{ marginTop: 2 }}>
                • {name}
              </Text>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { paddingVertical: 12 },
  error: { color: "tomato", fontWeight: "600" },

  filterBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2196F3",
    paddingVertical: 12,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeBtn: {
    backgroundColor: "#1976D2",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },

  selectedBox: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  selectedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
});
