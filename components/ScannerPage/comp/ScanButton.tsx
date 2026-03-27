import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface ScanButtonProps {
  label?: string;
  onPress: () => void;
}

const ScanButton: React.FC<ScanButtonProps> = ({
  label = "Skanuj",
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: scaleH(105),
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: scaleW(200),
    paddingVertical: scaleH(16),
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: scaleW(40),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: scaleW(19),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    letterSpacing: scaleW(0.5),
    lineHeight: scaleH(22),
    textAlignVertical: "center",
  },
});

export default ScanButton;
