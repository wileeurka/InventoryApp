import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

const ExportButton = ({ scaleW, scaleH, onPress, disabled }: any) => {
  return (
    <View style={[styles.wrapper, { paddingHorizontal: scaleW(27) }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.button,
          {
            height: scaleH(59),
            borderRadius: scaleW(40),
            paddingHorizontal: scaleW(25),
            backgroundColor: disabled
              ? "rgba(28,28,28,0.4)"
              : "rgba(28,28,28,0.8)",
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: scaleW(19),
              color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
            },
          ]}
        >
          Eksportuj do Excela
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: scaleH(119),
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
  text: {
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    lineHeight: 21,
    letterSpacing: 0.5,
  },
});

export default ExportButton;
