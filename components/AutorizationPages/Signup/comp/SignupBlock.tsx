import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import SignupInputRow from "./SignupInputRow";
import SignupButton from "./SignupButton";

const { width: W, height: H } = Dimensions.get("window");
const scaleW = (n) => (n * W) / 402;
const scaleH = (n) => (n * H) / 874;

export default function SignupBlock({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const shiftY = useRef(new Animated.Value(0)).current;

  const lift = () => {
    Animated.timing(shiftY, {
      toValue: -scaleH(120),
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
    if (onRegister) {
      onRegister(name, email, password);
    }
  };

  return (
    <Animated.View
      style={[styles.wrapper, { transform: [{ translateY: shiftY }] }]}
    >
      <Text style={styles.title}>Zarejestruj się</Text>

      <View style={styles.inputsContainer}>
        <SignupInputRow
          nameValue={name}
          onNameChange={setName}
          onFocusName={lift}
          onBlurName={drop}
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

      <SignupButton onPress={handlePress} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: scaleW(617),
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
});
