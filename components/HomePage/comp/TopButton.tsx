import React from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * width) / BASE_WIDTH;
const scaleH = (size: number) => (size * height) / BASE_HEIGHT;

interface TopButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  icon?: any;
  iconWidth?: number;
  iconHeight?: number;
  style?: StyleProp<ViewStyle>;
}

const TopButton: React.FC<TopButtonProps> = ({
  onPress,
  icon,
  iconWidth = 24,
  iconHeight = 24,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, style]}
    >
      {icon && (
        <Image
          source={icon}
          style={{
            width: scaleW(iconWidth),
            height: scaleH(iconHeight),
            tintColor: "#fff",
          }}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: scaleW(62),
    height: scaleH(36),
    borderRadius: scaleW(25),
    borderWidth: 1,
    borderColor: "rgba(61, 60, 60, 0.67)",
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.45)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
});

export default TopButton;
