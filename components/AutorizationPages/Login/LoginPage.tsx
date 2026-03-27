import React, { useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import TopButton from "../../HomePage/comp/TopButton";
import LoginBlock from "./comp/LoginBlock";
import ToastNotification from "../../Notifications/ToastNotification";
import { useAuth } from "../../../context/AuthContext";

const { width: W } = Dimensions.get("window");
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

export default function LoginPage({ onNavigate, openSidebar }) {
  const { login } = useAuth();
  const [errorToast, setErrorToast] = useState({ visible: false, message: "" });

  const showError = (msg) => {
    setErrorToast({ visible: true, message: msg });
    setTimeout(() => {
      setErrorToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleLoginAttempt = async (email, password) => {
    if (!email || !password) {
      showError("Proszę wpisać e-mail i hasło");
      return;
    }

    try {
      const isSuccess = await login(email, password);
      if (isSuccess) {
        onNavigate("home", {
          toastMessage: "Zalogowano pomyślnie!",
        });
      } else {
        showError("Nieprawidłowy e-mail lub hasło");
      }
    } catch (error) {
      console.log(error);
      showError("Wystąpił błąd systemu");
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
        <LoginBlock
          onLoginSubmit={handleLoginAttempt}
          onNavigate={onNavigate}
        />
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
