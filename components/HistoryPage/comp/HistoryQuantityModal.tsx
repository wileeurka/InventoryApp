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

export interface ModalQuantityProps {
  visible: boolean;
  initial: number;
  onClose: () => void;
  onSubmit: (value: number) => void;
}

const HistoryQuantityModal: React.FC<ModalQuantityProps> = ({
  visible,
  initial,
  onClose,
  onSubmit,
}) => {
  const [quantity, setQuantity] = useState(initial);
  const [tempValue, setTempValue] = useState(String(initial));
  const [bottomOffset, setBottomOffset] = useState(scaleH(50));

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setQuantity(initial);
      setTempValue(String(initial));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible, initial]);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        const keyboardHeight = e.endCoordinates.height;
        setBottomOffset(scaleH(20));
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setBottomOffset(scaleH(50))
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleChangeText = (text: string) => {
    if (text === "" || /^[0-9]+$/.test(text)) {
      setTempValue(text);
    }
  };

  const handleSave = () => {
    const parsed = parseInt(tempValue, 10);
    const finalQty = !isNaN(parsed) && parsed > 0 ? parsed : quantity;
    Keyboard.dismiss();
    onSubmit(finalQty);
    onClose();
  };

  const handleManualBlur = () => {
    const parsed = parseInt(tempValue, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantity(parsed);
    } else {
      setQuantity(1);
      setTempValue("1");
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      />

      <View style={[styles.container, { bottom: bottomOffset }]}>
        <View style={styles.counterWrapper}>
          <TouchableOpacity
            style={styles.counterButton}
            activeOpacity={0.7}
            onPress={() => {
              let currentVal = parseInt(tempValue, 10);
              if (isNaN(currentVal)) currentVal = quantity;

              if (currentVal > 1) {
                const newVal = currentVal - 1;
                setQuantity(newVal);
                setTempValue(String(newVal));
              }
            }}
          >
            <Text style={styles.counterSymbol}>–</Text>
          </TouchableOpacity>

          <View style={styles.quantityBox}>
            <TextInput
              ref={inputRef}
              style={styles.quantityInput}
              keyboardType="number-pad"
              value={tempValue}
              onChangeText={handleChangeText}
              onBlur={handleManualBlur}
              selectTextOnFocus={true}
              maxLength={4}
              selectionColor="#fff"
            />
          </View>

          <TouchableOpacity
            style={styles.counterButton}
            activeOpacity={0.7}
            onPress={() => {
              let currentVal = parseInt(tempValue, 10);
              if (isNaN(currentVal)) currentVal = quantity;

              const newVal = currentVal + 1;
              setQuantity(newVal);
              setTempValue(String(newVal));
            }}
          >
            <Text style={styles.counterSymbol}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.85}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Zapisz</Text>
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
  wrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  container: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scaleW(15),
    paddingHorizontal: scaleH(28),
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
    height: "100%",
    justifyContent: "center",
  },
  counterSymbol: {
    color: "rgba(255,255,255,0.85)",
    fontSize: scaleW(22),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed", 
  },
  quantityBox: {
    width: scaleW(55),
    alignItems: "center",
    justifyContent: "center",
  },
  quantityInput: {
    color: "white",
    fontSize: scaleW(20),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    textAlign: "center",
    padding: 0,
    width: "100%",
  },

  saveButton: {
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
  saveButtonText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: scaleW(19),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    letterSpacing: scaleW(0.5),
  },
});

export default HistoryQuantityModal;
