import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface QuantityAddProps {
  onAdd: (quantity: number) => void;
}

const QuantityAdd: React.FC<QuantityAddProps> = ({ onAdd }) => {
  const [quantity, setQuantity] = useState(1);
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState("1");
  const [bottomOffset, setBottomOffset] = useState(scaleH(50));

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setBottomOffset(scaleH(30))
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setBottomOffset(scaleH(70))
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleNumberPress = () => {
    setTempValue(String(quantity));
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleChangeText = (text: string) => {
    if (text === "" || /^[0-9]+$/.test(text)) {
      setTempValue(text);
    }
  };

  const handleEndEditing = () => {
    setEditing(false);
    const parsed = parseInt(tempValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantity(parsed);
    } else {
      setQuantity(1);
      setTempValue("1");
    }
    Keyboard.dismiss();
  };

  const handleAddPress = () => {
    const parsed = parseInt(tempValue, 10);

    const finalQuantity = !isNaN(parsed) && parsed > 0 ? parsed : quantity;
    setQuantity(finalQuantity);
    setTempValue(String(finalQuantity));
    setEditing(false);
    Keyboard.dismiss();

    onAdd(finalQuantity);
  };

  return (
    <View style={{ position: "absolute", bottom: bottomOffset, width: "100%" }}>
      {editing && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={handleEndEditing}
        />
      )}

      <View style={styles.container}>
        <View style={styles.counterWrapper}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => {
              if (quantity > 1) {
                const newVal = quantity - 1;
                setQuantity(newVal);
                setTempValue(String(newVal)); 
              } else if (editing && Number(tempValue) > 1) {
                const newVal = Number(tempValue) - 1;
                setQuantity(newVal);
                setTempValue(String(newVal));
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.counterSymbol}>–</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quantityBox}
            onPress={handleNumberPress}
            activeOpacity={0.7}
          >
            {editing ? (
              <TextInput
                ref={inputRef}
                style={styles.quantityInput}
                keyboardType="number-pad"
                value={tempValue}
                onChangeText={handleChangeText}
                onBlur={handleEndEditing}
                selectTextOnFocus={true}
                maxLength={3}
              />
            ) : (
              <Text style={styles.quantityText}>{quantity}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => {
              const currentVal = editing
                ? Number(tempValue) || quantity
                : quantity;
              const newVal = currentVal + 1;
              setQuantity(newVal);
              setTempValue(String(newVal));
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.counterSymbol}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={handleAddPress} 
        >
          <Text style={styles.addButtonText}>Dodaj</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const sharedStyles = {
  bg: "rgba(21,21,21,0.9)",
  border: "rgba(218,218,218,0.08)",
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: -1000,
    bottom: -1000,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scaleW(15),
    paddingHorizontal: scaleH(28),
    zIndex: 11,
  },
  counterWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: sharedStyles.bg,
    borderRadius: scaleW(40),
    borderWidth: 1,
    borderColor: sharedStyles.border,
    paddingVertical: scaleH(14),
  },
  counterButton: {
    paddingHorizontal: scaleW(12),
  },
  counterSymbol: {
    color: "rgba(255,255,255,0.85)",
    fontSize: scaleW(22),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
  },
  quantityBox: {
    width: scaleW(55),
    alignItems: "center",
  },
  quantityText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: scaleW(20),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
  },
  quantityInput: {
    color: "white",
    fontSize: scaleW(20),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    textAlign: "center",
    padding: 0,
    width: "100%",
  },
  addButton: {
    flex: 1,
    backgroundColor: sharedStyles.bg,
    borderRadius: scaleW(40),
    borderWidth: 1,
    borderColor: sharedStyles.border,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scaleH(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  addButtonText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: scaleW(19),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    letterSpacing: scaleW(0.5),
  },
});

export default QuantityAdd;
