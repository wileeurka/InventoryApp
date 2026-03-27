import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const scaleW = (size: number) => size;
const scaleH = (size: number) => size;

interface ProductDetailsBlocksProps {
  flavor: string;
  opis: string;
}

const ProductDetailsBlocks: React.FC<ProductDetailsBlocksProps> = ({
  flavor,
  opis,
}) => {
  return (
    <View style={{ width: "100%" }}>
      <View style={styles.inputWrapper}>
        <Text style={styles.displayText}>
          <Text style={styles.labelBold}>Smak: </Text>
          {flavor}
        </Text>
      </View>

      <View style={[styles.inputWrapper, { marginBottom: 0 }]}>
        <Text style={styles.labelBold}>Opis towaru:</Text>
        <View style={styles.stroke} />
        <Text style={styles.displayOpis}>{opis}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: scaleW(20),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    paddingHorizontal: scaleW(17),
    paddingVertical: scaleH(16),
    marginBottom: scaleH(21),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  labelBold: {
    color: "rgba(255,255,255,0.6)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Regular",
    fontWeight: "600",
    marginBottom: scaleH(6),
    letterSpacing: 0.5,
  },
  displayText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Regular",
    letterSpacing: 0.5,
  },
  displayOpis: {
    marginTop: scaleH(5),
    color: "rgba(255,255,255,0.9)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Regular",
    lineHeight: scaleH(21),
    letterSpacing: 0.5,
  },
  stroke: {
    height: 1,
    backgroundColor: "#373737",
    marginTop: scaleH(4),
    marginBottom: scaleH(10),
  },
});

export default ProductDetailsBlocks;
