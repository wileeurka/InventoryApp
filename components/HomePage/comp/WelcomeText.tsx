import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../../../context/AuthContext";

const { width, height } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * width) / BASE_WIDTH;
const scaleH = (size: number) => (size * height) / BASE_HEIGHT;

const WelcomeText = () => {
  const { user } = useAuth();
  const username = user?.name || "Gość";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Witamy,{"\n"}
        <Text style={styles.username}>{username}!</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: scaleW(22),
    color: "#fff",
    fontFamily: "Satoshi-Regular",
    lineHeight: scaleH(40),
    letterSpacing: scaleW(1),
    marginTop: scaleH(25),
  },
  username: {
    fontSize: scaleW(26),
    fontWeight: "700",
    fontFamily: "Satoshi-Bold",
  },
});

export default WelcomeText;
