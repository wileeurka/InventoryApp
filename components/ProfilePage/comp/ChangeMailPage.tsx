import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import HeaderGradientBlock from "../../HeaderGradient/HeaderGradientBlock";
import ToastNotification from "../../Notifications/ToastNotification";
import { useNavigation } from "@react-navigation/native";
import { apiRequest } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const { width: W, height: H } = Dimensions.get("window");
const scaleW = (n: number) => (n * W) / 402;
const scaleH = (n: number) => (n * H) / 874;

interface ChangeMailPageProps {
  openSidebar?: () => void;
}

const ChangeMailPage: React.FC<ChangeMailPageProps> = ({ openSidebar }) => {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passHidden, setPassHidden] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "error" as "error" | "success" });

  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3500);
  };

  const handleSave = async () => {
    if (!newEmail.trim() || !currentPassword.trim()) {
      showToast("Wypełnij wszystkie pola");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      showToast("Nieprawidłowy adres e-mail");
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequest("/users/me/email", {
        method: "PATCH",
        body: JSON.stringify({ newEmail: newEmail.trim(), currentPassword }),
      });
      if (res.ok) {
        showToast("E-mail został zmieniony", "success");
        setTimeout(() => navigation.goBack(), 1600);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || "Błąd zmiany e-maila");
      }
    } catch (e) {
      showToast("Brak połączenia z serwerem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0D0D0D" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />
      <HeaderGradientBlock openSidebar={openSidebar || (() => {})} height={scaleH(200)} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Zmień e-mail</Text>

        {user?.email && (
          <Text style={styles.subtitle}>Aktualny: {user.email}</Text>
        )}

        {/* Card: new email + current password */}
        <View style={styles.card}>
          {/* Row: new email */}
          <View style={[styles.row, { marginBottom: scaleH(6) }]}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(100,255,200,0.35)" }]}>
              <Image
                source={require("../../../assets/icons/auth/email-icon.webp")}
                style={styles.icon}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nowy adres e-mail"
              placeholderTextColor={emailFocused ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"}
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          <View style={styles.divider} />

          {/* Row: current password */}
          <View style={[styles.row, { marginTop: scaleH(6) }]}>
            <View style={[styles.iconCircle, { backgroundColor: "rgba(160,100,255,0.35)" }]}>
              <Image
                source={require("../../../assets/icons/auth/password-icon.webp")}
                style={styles.icon}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Aktualne hasło"
              placeholderTextColor={passFocused ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"}
              secureTextEntry={passHidden}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setPassHidden(!passHidden)}
              activeOpacity={0.6}
            >
              <Image
                source={
                  passHidden
                    ? require("../../../assets/icons/auth/open-eye-icon.webp")
                    : require("../../../assets/icons/auth/close-eye-icon.webp")
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* Buttons pinned to bottom */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.55 }]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="rgba(255,255,255,0.8)" />
            : <Text style={styles.btnText}>Zapisz zmiany</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Anuluj</Text>
        </TouchableOpacity>
      </View>

      <ToastNotification
        visible={toast.visible}
        message={toast.message}
        type={toast.type as any}
        onHide={() => setToast((p) => ({ ...p, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: scaleW(25),
    paddingBottom: scaleH(60),
  },
  title: {
    color: "#fff",
    fontSize: scaleW(26),
    fontFamily: "Satoshi-Bold",
    textAlign: "center",
    marginTop: scaleH(40),
    marginBottom: scaleH(8),
    letterSpacing: scaleW(26) * 0.04,
  },
  subtitle: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    textAlign: "center",
    marginBottom: scaleH(32),
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: scaleW(20),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    paddingHorizontal: scaleW(16),
    paddingVertical: scaleH(6),
    marginBottom: scaleH(50),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: scaleH(60),
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    width: "100%",
  },
  iconCircle: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: scaleW(18),
    height: scaleW(18),
  },
  input: {
    flex: 1,
    marginLeft: scaleW(16),
    color: "rgba(255,255,255,0.85)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Regular",
  },
  eyeBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  btn: {
    width: "100%",
    paddingVertical: scaleH(16),
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: scaleW(40),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: scaleH(20),
  },
  btnText: {
    color: "#fff",
    fontSize: scaleW(17),
    fontFamily: "SF-Pro-Rounded-Medium",
    letterSpacing: scaleW(0.5),
  },
  cancelBtn: {
    alignItems: "center",
  },
  cancelText: {
    color: "rgba(255,255,255,0.35)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    textDecorationLine: "none",
    letterSpacing: 0.5,
  },
  bottomButtons: {
    paddingHorizontal: scaleW(25),
    paddingBottom: scaleH(44),
    paddingTop: scaleH(16),
    backgroundColor: "#0D0D0D",
  },
});

export default ChangeMailPage;
