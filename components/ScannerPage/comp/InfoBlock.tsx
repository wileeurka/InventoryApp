import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface InfoBlockProps {
  title: string;
  description: string;
  height?: number;
}

const InfoBlock: React.FC<InfoBlockProps> = ({
  title,
  description,

}) => {
  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: scaleW(20),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    paddingHorizontal: scaleW(30),
    paddingVertical: scaleH(20),

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,

    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontFamily: "Satoshi-Bold",
    fontSize: scaleW(18),
    marginBottom: scaleH(17),
    letterSpacing: scaleW(18) * 0.04,
    textAlign: "center",
  },

  description: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: "SF-Pro-Rounded-Regular-Fixed",
    fontSize: scaleW(12),
    lineHeight: scaleH(21),
    letterSpacing: 0.5,
    textAlign: "center",
  },
});

export default InfoBlock;
