import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";

interface ToastNotificationProps {
  visible: boolean;
  message: string;
  onHide?: () => void;
  type?: "success" | "error";
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  message,
  onHide,
  type = "success",
}) => {
  const translateY = useRef(new Animated.Value(200)).current;

  const backgroundColor = type === "error" ? "#E74C3C" : "#27AE60";
  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 4,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 200,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (onHide) onHide();
      });
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.container,
        { transform: [{ translateY }], backgroundColor },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingHorizontal: 25,
    paddingBottom: Platform.OS === "ios" ? 30 : 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 9999999,
    elevation: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Satoshi-Medium",
    flex: 1,
    textAlign: "left",
  },
});

export default ToastNotification;
