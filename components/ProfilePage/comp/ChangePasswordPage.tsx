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

const { width: W, height: H } = Dimensions.get("window");
const scaleW = (n: number) => (n * W) / 402;
const scaleH = (n: number) => (n * H) / 874;

interface ChangePasswordPageProps {
  openSidebar?: () => void;
}

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({
  openSidebar,
}) => {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [hideCurrent, setHideCurrent] = useState(true);
  const [hideNew, setHideNew] = useState(true);
  const [hideRepeat, setHideRepeat] = useState(true);

  const [curFocused, setCurFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [repFocused, setRepFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error" as "error" | "success",
  });

  const showToast = (msg: string, type: "error" | "success" = "error") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3500);
  };

  const handleSave = async () => {
    if (!currentPassword || !newPassword || !repeatPassword) {
      showToast("Wypełnij wszystkie pola");
      return;
    }
    if (newPassword !== repeatPassword) {
      showToast("Nowe hasła nie są identyczne");
      return;
    }
    if (newPassword.length < 8) {
      showToast("Hasło musi mieć co najmniej 8 znaków");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      showToast("Hasło musi zawierać znak specjalny");
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest("/users/me/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        showToast("Hasło zostało zmienione", "success");
        setTimeout(() => navigation.goBack(), 1600);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || "Błąd zmiany hasła");
      }
    } catch (e) {
      showToast("Brak połączenia z serwerem");
    } finally {
      setLoading(false);
    }
  };

  const PasswordRow = ({
    value,
    onChange,
    placeholder,
    hidden,
    setHidden,
    focused,
    setFocused,
    iconColor,
    iconTintColor,
    withDivider = true,
  }: any) => (
    <>
      {withDivider && <View style={styles.divider} />}
      <View style={styles.row}>
        <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
          <Image
            source={require("../../../assets/icons/auth/password-icon.webp")}
            style={styles.icon}
            tintColor={iconTintColor || undefined}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={
            focused ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"
          }
          secureTextEntry={hidden}
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setHidden(!hidden)}
          activeOpacity={0.6}
        >
          <Image
            source={
              hidden
                ? require("../../../assets/icons/auth/open-eye-icon.webp")
                : require("../../../assets/icons/auth/close-eye-icon.webp")
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0D0D0D" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />
      <HeaderGradientBlock
        openSidebar={openSidebar || (() => {})}
        height={scaleH(200)}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Zmień hasło</Text>
        <Text style={styles.subtitle}>
          Nowe hasło musi mieć min. 8 znaków i zawierać znak specjalny
        </Text>


        <View style={styles.card}>

          <View style={styles.row}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: "rgba(255,160,100,0.35)" },
              ]}
            >
              <Image
                source={require("../../../assets/icons/auth/password-icon.webp")}
                style={styles.icon}
                tintColor="#e8dccb"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Aktualne hasło"
              placeholderTextColor={
                curFocused ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"
              }
              secureTextEntry={hideCurrent}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              onFocus={() => setCurFocused(true)}
              onBlur={() => setCurFocused(false)}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setHideCurrent(!hideCurrent)}
              activeOpacity={0.6}
            >
              <Image
                source={
                  hideCurrent
                    ? require("../../../assets/icons/auth/open-eye-icon.webp")
                    : require("../../../assets/icons/auth/close-eye-icon.webp")
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <PasswordRow
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Nowe hasło"
            hidden={hideNew}
            setHidden={setHideNew}
            focused={newFocused}
            setFocused={setNewFocused}
            iconColor="rgba(160,100,255,0.35)"
          />

          <PasswordRow
            value={repeatPassword}
            onChange={setRepeatPassword}
            placeholder="Powtórz nowe hasło"
            hidden={hideRepeat}
            setHidden={setHideRepeat}
            focused={repFocused}
            setFocused={setRepFocused}
            iconColor="rgba(100,200,255,0.35)"
            iconTintColor="#cedee2"
          />
        </View>
      </ScrollView>


      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.55 }]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="rgba(255,255,255,0.8)" />
          ) : (
            <Text style={styles.btnText}>Zapisz zmiany</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelBtn}
        >
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
    marginTop: scaleH(50),
    marginBottom: scaleH(8),
    letterSpacing: scaleW(26) * 0.04,
  },
  subtitle: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(13),
    textAlign: "center",
    marginBottom: scaleH(32),
    letterSpacing: 0.3,
    lineHeight: scaleH(20),
    paddingHorizontal: scaleW(15),
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
    letterSpacing: 0.5,
  },
  bottomButtons: {
    paddingHorizontal: scaleW(25),
    paddingBottom: scaleH(44),
    paddingTop: scaleH(16),
    backgroundColor: "#0D0D0D",
  },
});

export default ChangePasswordPage;
