import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import QuantityInlineSelector from "./QuantityInlineSelector";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface Props {
  dayLabel: string;
  items: any[];
  onOpenModal: (itemId: string, currentQty: number) => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  isSelected: boolean;
  onToggle: () => void;
}

const ProductDayBlock: React.FC<Props> = ({
  dayLabel,
  items,
  onOpenModal,
  onUpdateQuantity,
  isSelected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onToggle}
      style={[styles.wrapper, isSelected && styles.wrapperSelected]}
    >
      <View style={styles.header}>
        <Text style={styles.dayLabel}>{dayLabel}</Text>

        <TouchableOpacity
          style={[styles.checkbox, isSelected && styles.checkboxActive]}
          onPress={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          activeOpacity={0.8}
        >
          {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
        </TouchableOpacity>
      </View>

      {items.map((item: any, i: number) => (
        <View key={item.id || i} style={styles.itemRow}>
          <View style={styles.leftCol}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCode}>{item.code}</Text>
            <Text style={styles.itemExtra}>{item.extra}</Text>
          </View>

          <View style={styles.qtyWrapper}>
            <QuantityInlineSelector
              value={item.quantity}
              stopPropagation
              onChange={(v) => {
                if (item.id) {
                  onUpdateQuantity(item.id, v);
                }
              }}
              onEditRequest={(qty) => {
                if (item.id) {
                  onOpenModal(item.id, qty);
                }
              }}
            />
          </View>
        </View>
      ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#121212",
    borderRadius: scaleW(20),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingVertical: scaleH(18),
    paddingHorizontal: scaleW(25),
    marginBottom: scaleH(25),
  },
  wrapperSelected: {
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleH(15),
  },
  dayLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  checkbox: {
    width: scaleW(22),
    height: scaleW(22),
    backgroundColor: "#0D0D0D",
    borderRadius: scaleW(6),
    borderWidth: 1.5,
    borderColor: "rgba(218,218,218,0.08)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  checkboxActive: {
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  checkboxTick: {
    color: "#000",
    fontSize: scaleW(15),
    fontWeight: "800",
    includeFontPadding: false,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingTop: scaleH(20),
    paddingBottom: scaleH(20),
  },
  leftCol: {
    flexDirection: "column",
    flexShrink: 1,
  },
  qtyWrapper: {
    justifyContent: "flex-start",
    marginTop: Platform.select({
      ios: scaleH(30),
      android: scaleH(50),
    }),
  },
  itemName: {
    color: "rgba(255,255,255,0.8)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Medium",
    letterSpacing: 0.5,
    marginBottom: scaleH(15),
    includeFontPadding: false,
  },
  itemCode: {
    color: "rgba(255,255,255,0.6)",
    marginBottom: scaleH(7),
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  itemExtra: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
});

export default ProductDayBlock;
