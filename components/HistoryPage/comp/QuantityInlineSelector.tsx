import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 402;
const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;

interface Props {
  value?: number;
  onChange?: (val: number) => void;
  stopPropagation?: boolean;
  onEditRequest?: (currentValue: number) => void;
}

const QuantityInlineSelector: React.FC<Props> = ({
  value = 1,
  onChange,
  stopPropagation = false,
  onEditRequest,
}) => {
  const [qty, setQty] = useState(value);

  useEffect(() => {
    setQty(value);
  }, [value]);
  const wrap = (fn: () => void) => (e: GestureResponderEvent) => {
    if (stopPropagation && e.stopPropagation) e.stopPropagation();
    fn();
  };

  const update = (n: number) => {
    setQty(n);
    onChange?.(n);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={wrap(() => qty > 1 && update(qty - 1))}
        activeOpacity={0.7}
      >
        <Text style={styles.symbol}>–</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.numberBox}
        activeOpacity={0.7}
        onPress={() => onEditRequest?.(qty)}
      >
        <Text style={styles.number}>{qty}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={wrap(() => update(qty + 1))}
        activeOpacity={0.7}
      >
        <Text style={styles.symbol}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#0D0D0D",
    borderRadius: scaleW(40),
    borderWidth: 1.5,
    borderColor: "rgba(218,218,218,0.08)",
    paddingVertical: scaleW(8),
    paddingHorizontal: scaleW(12),
    alignItems: "center",
  },
  btn: {
    paddingHorizontal: scaleW(10),
  },
  symbol: {
    color: "rgba(255,255,255,0.85)",
    fontSize: scaleW(20),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
  },
  numberBox: {
    width: scaleW(40),
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    color: "white",
    fontSize: scaleW(18),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
  },
});

export default QuantityInlineSelector;
