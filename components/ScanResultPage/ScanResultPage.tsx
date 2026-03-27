import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import HeaderGradientBlock from "../HeaderGradient/HeaderGradientBlock";
import ProductDetailsBlocks from "./comp/ProductDetailsBlocks";
import QuantityAdd from "./comp/QuantitySelector";
import { useStats } from "../../context/StatsContext";
import { useHistory } from "../../context/HistoryContext";
import { apiRequest } from "../../services/api";
import { useRoute } from "@react-navigation/native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

const paddingHorizontal = scaleW(27);

interface ScanResultPageProps {
  openSidebar: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

interface Product {
  id: string;
  name: string;
  code: string;
  flavor?: string;
  description?: string;
}

const ScanResultPage: React.FC<ScanResultPageProps> = ({
  openSidebar,
  onNavigate,
}) => {
  const { refreshStats } = useStats();
  const { addToHistory } = useHistory();
  const route = useRoute<any>();
  const productCode: string | undefined = route.params?.productCode;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productCode) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(`/products/by-code/${encodeURIComponent(productCode)}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          setError("Produkt nie został znaleziony w systemie");
        }
      } catch (e) {
        setError("Brak połączenia z serwerem");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productCode]);

  const handleAddToCart = async (quantity: number) => {
    if (!product) return;
    try {
      await addToHistory(product.id, quantity);
      await refreshStats();
      onNavigate("home", {
        toastMessage: "Produkt został dodany do listy produktów",
      });
    } catch (e) {
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Wyszukuję produkt…</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorCode}>Kod: {productCode}</Text>
        </View>
      );
    }

    if (!product) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Brak kodu produktu</Text>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.productCodeContainer}>
          <Text style={styles.productCode}>Kod: {product.code}</Text>
        </View>
        <ProductDetailsBlocks
          flavor={product.flavor || "–"}
          opis={product.description || "–"}
        />
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0D0D0D" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={scaleH(1)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <HeaderGradientBlock openSidebar={openSidebar} height={scaleH(152)} />

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal,
              paddingBottom: scaleH(140),
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderContent()}
          </ScrollView>

          {product && <QuantityAdd onAdd={handleAddToCart} />}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: scaleH(60),
  },
  loadingText: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 12,
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(15),
  },
  errorText: {
    color: "rgba(255,100,100,0.9)",
    fontFamily: "Satoshi-Medium",
    fontSize: scaleW(18),
    textAlign: "center",
    marginBottom: 8,
  },
  errorCode: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(13),
  },
  productName: {
    color: "#fff",
    fontSize: scaleW(22),
    fontFamily: "Satoshi-Medium",
    lineHeight: 40,
    letterSpacing: scaleW(22) * 0.04,
    marginTop: scaleH(35),
    marginBottom: scaleH(10),
    textAlign: "center",
  },
  productCodeContainer: {
    alignSelf: "center",
    paddingVertical: Platform.select({
      ios: scaleH(6),
      android: scaleH(4),
    }),
    paddingHorizontal: scaleW(18),
    borderRadius: scaleW(30),
    marginBottom: scaleH(35),
    backgroundColor: "rgba(13, 13, 13, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  productCode: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    letterSpacing: scaleW(14) * 0.04,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});

export default ScanResultPage;
