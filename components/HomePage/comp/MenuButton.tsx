import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface MenuButtonProps {
  index: number;
  onPress?: () => void;
  width?: number;
  height?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

const buttonsData = [
  {
    label: "Skaner",
    gradient: ["#1AADFE", "#058BF7"] as const,
    icon: require("../../../assets/icons/homepage/scan-icon.webp"),
  },
  {
    label: "Lista produktów",
    gradient: ["#7CE2B3", "#2EC995"] as const,
    icon: require("../../../assets/icons/homepage/products-icon.webp"),
  },
  {
    label: "Dodaj produkt",
    gradient: ["#9F70FF", "#7732FF"] as const,
    icon: require("../../../assets/icons/homepage/add-icon.webp"),
  },
  {
    label: "Historia zapasów",
    gradient: ["#F98C57", "#FC7355"] as const,
    icon: require("../../../assets/icons/homepage/history-icon.webp"),
  },
];

const MenuButton: React.FC<MenuButtonProps> = ({
  index,
  onPress,
  width = scaleW(166),
  height = scaleH(166),
}) => {
  const item = buttonsData[index];
  if (!item) return null;

  return (
    <TouchableOpacity
      style={[styles.wrapper, { width, height }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.inner}>
        <LinearGradient
          colors={item.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.circle}
        >
          <Image source={item.icon} style={styles.icon} resizeMode="contain" />
        </LinearGradient>
        <Text style={styles.label}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
  },
  inner: {
    flex: 1,
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  circle: {
    width: scaleW(85),
    height: scaleH(85),
    borderRadius: scaleW(50),
    opacity: 0.9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: scaleW(15),
  },
  icon: {
    width: scaleW(35),
    height: scaleH(35),
  },
  label: {
    color: "white",
    fontSize: scaleW(15),
    fontFamily: "SF-Pro-Rounded-Medium",
    textAlign: "center",
    lineHeight: scaleH(21),
    letterSpacing: scaleW(0.5),
  },
});

export default MenuButton;
