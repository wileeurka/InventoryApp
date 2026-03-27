import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import HeaderGradientBlock from "../HeaderGradient/HeaderGradientBlock";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { apiRequest } from "../../services/api";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface ProductItem {
  id: string;
  name: string;
  code: string;
  flavor?: string;
  description?: string;
}

interface ProductListPageProps {
  openSidebar: () => void;
}

type ProductListNav = NativeStackNavigationProp<RootStackParamList>;

const ProductListPage: React.FC<ProductListPageProps> = ({ openSidebar }) => {
  const navigation = useNavigation<ProductListNav>();
  const route = useRoute<RouteProp<RootStackParamList, "productList">>();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = query ? `/products?search=${encodeURIComponent(query)}` : "/products";
      const res = await apiRequest(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setError("Błąd pobierania produktów");
      }
    } catch (e) {
      setError("Brak połączenia z serwerem");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(text.trim() || undefined);
    }, 400);
  };

  const handleProductPress = (product: ProductItem) => {
    navigation.navigate("scanResultPage", { productCode: product.code });
  };

  const renderItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardCode}>Kod: {item.code}</Text>
        {item.flavor ? (
          <Text style={styles.cardFlavor}>Smak: {item.flavor}</Text>
        ) : null}
      </View>
      <Text style={styles.cardArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <HeaderGradientBlock openSidebar={openSidebar} height={scaleH(152)} />

      <View style={styles.content}>
        <Text style={styles.title}>Lista produktów</Text>

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Szukaj po nazwie, kodzie lub smaku…"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={search}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoFocus={route.params?.focusSearch}
            onSubmitEditing={() => fetchProducts(search.trim() || undefined)}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => {
                setSearch("");
                fetchProducts();
              }}
            >
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {!loading && error && (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => fetchProducts(search || undefined)}>
              <Text style={styles.retryText}>Spróbuj ponownie</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && products.length === 0 && (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {search ? `Brak wyników dla "${search}"` : "Brak produktów w systemie"}
            </Text>
          </View>
        )}

        {!loading && !error && products.length > 0 && (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  content: { flex: 1 },
  title: {
    color: "#fff",
    fontSize: scaleW(26),
    fontFamily: "Satoshi-Medium",
    lineHeight: 40,
    letterSpacing: scaleW(26) * 0.04,
    marginTop: scaleH(28),
    marginBottom: scaleH(16),
    textAlign: "center",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scaleW(25),
    marginBottom: scaleH(16),
    backgroundColor: "rgba(21,21,21,0.8)",
    borderRadius: scaleW(20),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.1)",
    paddingHorizontal: scaleW(17),
    paddingVertical: scaleH(13),
  },
  searchInput: {
    flex: 1,
    color: "rgba(255,255,255,0.9)",
    fontSize: scaleW(15),
    fontFamily: "SF-Pro-Rounded-Regular",
  },
  clearBtn: {
    paddingHorizontal: scaleW(8),
  },
  clearBtnText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: scaleW(16),
  },
  list: {
    paddingHorizontal: scaleW(25),
    paddingBottom: scaleH(120),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: scaleW(16),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    paddingHorizontal: scaleW(17),
    paddingVertical: scaleH(15),
    marginBottom: scaleH(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLeft: { flex: 1 },
  cardName: {
    color: "#fff",
    fontSize: scaleW(16),
    fontFamily: "Satoshi-Medium",
    marginBottom: 3,
  },
  cardCode: {
    color: "rgba(255,255,255,0.5)",
    fontSize: scaleW(13),
    fontFamily: "SF-Pro-Rounded-Regular",
  },
  cardFlavor: {
    color: "rgba(255,255,255,0.35)",
    fontSize: scaleW(12),
    fontFamily: "SF-Pro-Rounded-Regular",
    marginTop: 2,
  },
  cardArrow: {
    color: "rgba(255,255,255,0.3)",
    fontSize: scaleW(22),
    marginLeft: scaleW(8),
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Satoshi-Medium",
    fontSize: scaleW(16),
    textAlign: "center",
    paddingHorizontal: scaleW(30),
  },
  errorText: {
    color: "rgba(255,100,100,0.8)",
    fontFamily: "Satoshi-Medium",
    fontSize: scaleW(16),
    textAlign: "center",
  },
  retryText: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default ProductListPage;
