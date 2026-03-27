import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import LoginInputRow from "./LoginInputRow";
import LoginSignButton from "./LoginButton";

const { width: W, height: H } = Dimensions.get("window");
const scaleW = (n) => (n * W) / 402;
const scaleH = (n) => (n * H) / 874;

export default function LoginBlock({ onLoginSubmit, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const shiftY = useRef(new Animated.Value(0)).current;

  const lift = () => {
    Animated.timing(shiftY, {
      toValue: -scaleH(110),
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const drop = () => {
    Animated.timing(shiftY, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onLoginSubmit) {
      onLoginSubmit(email, password);
    }
  };

  return (
    <Animated.View
      style={[styles.wrapper, { transform: [{ translateY: shiftY }] }]}
    >
      <Text style={styles.title}>Zaloguj się</Text>

      <View style={styles.inputsContainer}>
        <LoginInputRow
          emailValue={email}
          onEmailChange={setEmail}
          passValue={password}
          onPassChange={setPassword}
          onFocusEmail={lift}
          onBlurEmail={drop}
          onFocusPassword={lift}
          onBlurPassword={drop}
        />
      </View>

      <TouchableOpacity
        onPress={() => onNavigate("ChangePasswordPage")}
        style={styles.forgotBlock}
      >
        <Text style={styles.forgot}>Nie pamiętasz hasła?</Text>
      </TouchableOpacity>

      <LoginSignButton onPress={handlePress} />

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.registerText}>Nie masz konta?</Text>
        <Text
          style={[styles.registerLink, { marginLeft: scaleW(5) }]}
          onPress={() => onNavigate("register")}
        >
          Zarejestruj się
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: scaleW(586),
    backgroundColor: "#0D0D0D",
    borderTopLeftRadius: scaleW(40),
    borderTopRightRadius: scaleW(40),
    paddingHorizontal: scaleW(25),
  },

  title: {
    color: "#fff",
    fontSize: scaleW(26),
    fontFamily: "Satoshi-Bold",
    textAlign: "center",
    marginTop: scaleH(70),
    marginBottom: scaleH(50),
    letterSpacing: scaleW(26) * 0.04,
  },

  inputsContainer: {},

  forgotBlock: {
    alignItems: "flex-end",
    marginBottom: scaleH(40),
  },

  forgot: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    textAlign: "center",
    letterSpacing: 0.5,
  },

  registerText: {
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    letterSpacing: 0.5,
  },

  registerLink: {
    color: "#fff",
    fontFamily: "SF-Pro-Rounded-SemiBold",
  },
});
