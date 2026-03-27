import React, { useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import TopButton from "../../HomePage/comp/TopButton";
import SignupBlock from "./comp/SignupBlock";
import ToastNotification from "../../Notifications/ToastNotification";
import { useAuth } from "../../../context/AuthContext";

const { width: W } = Dimensions.get("window");
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

export default function SignupPage({ onNavigate, openSidebar }) {
  const { register } = useAuth();
  const [errorToast, setErrorToast] = useState({ visible: false, message: "" });

  const showError = (msg) => {
    setErrorToast({ visible: true, message: msg });
    setTimeout(() => {
      setErrorToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const validateAndRegister = async (name, email, password) => {
    if (!name || !email || !password) {
      showError("Proszę wypełnić wszystkie pola");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Nieprawidłowy adres e-mail (brak @ lub domeny)");
      return;
    }

    if (password.length < 8) {
      showError("Hasło musi zawierać co najmniej 8 znaków");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      showError("Hasło musi zawierać znak specjalny (np. @, #)");
      return;
    }

    try {
      await register(name, email, password);

      onNavigate("home", {
        toastMessage: "Udało się! Konto zostało utworzone",
      });
    } catch (error) {
      console.log(error);
      showError(
        "Nie udało się zarejestrować. Ten e-mail może być zajęty lub wystąpił błąd sieci."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/login-bg.webp")}
        style={styles.bgImage}
      />

      <View style={styles.topButtonWrapper}>
        <TopButton
          icon={require("../../../assets/icons/menu-icon.webp")}
          iconWidth={16}
          iconHeight={16}
          onPress={openSidebar}
        />
      </View>

      <View style={styles.bottomWrapper}>
        <SignupBlock onRegister={validateAndRegister} />
      </View>

      <ToastNotification
        visible={errorToast.visible}
        message={errorToast.message}
        type="error"
        onHide={() => setErrorToast((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  bgImage: {
    width: W,
    height: W,
    position: "absolute",
    top: 0,
    left: 0,
  },
  topButtonWrapper: {
    position: "absolute",
    top: scaleH(78),
    left: scaleW(25),
    zIndex: 20,
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
