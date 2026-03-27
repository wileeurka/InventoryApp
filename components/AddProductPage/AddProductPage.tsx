import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  Animated,
  Keyboard,
  Easing,
  Alert,
} from "react-native";
import HeaderGradientBlock from "../HeaderGradient/HeaderGradientBlock";
import AddProductInputs from "./comp/AddProductInputs";
import AddButton from "./comp/AddButton";
import ToastNotification from "../../components/Notifications/ToastNotification";
import { useStats } from "../../context/StatsContext";
import { apiRequest } from "../../services/api";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface AddProductPageProps {
  openSidebar: () => void;
  onNavigate: (screen: string, params?: { toastMessage?: string }) => void;
}

const AddProductPage: React.FC<AddProductPageProps> = ({
  openSidebar,
  onNavigate,
}) => {
  const { refreshStats } = useStats();
  const paddingHorizontal = scaleW(27);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const shiftAnim = useRef(new Animated.Value(0)).current;
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [flavor, setFlavor] = useState("");
  const [opis, setOpis] = useState("");
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({
    name: false,
    code: false,
    flavor: false,
    opis: false,
  });

  const [errorToast, setErrorToast] = useState({ visible: false, message: "" });

  const showError = (msg: string) => {
    setErrorToast({ visible: true, message: msg });
    setTimeout(() => {
      setErrorToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleChangeName = (text: string) => {
    setName(text);
    if (text) setErrors((prev) => ({ ...prev, name: false }));
  };
  const handleChangeCode = (text: string) => {
    setCode(text);
    if (text) setErrors((prev) => ({ ...prev, code: false }));
  };
  const handleChangeFlavor = (text: string) => {
    setFlavor(text);
    if (text) setErrors((prev) => ({ ...prev, flavor: false }));
  };
  const handleChangeOpis = (text: string) => {
    setOpis(text);
    if (text) setErrors((prev) => ({ ...prev, opis: false }));
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      if (focusedField === "opis") {
        Animated.timing(shiftAnim, {
          toValue: -scaleH(215),
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(shiftAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [focusedField]);

  const handleSaveAndExit = async () => {
    Keyboard.dismiss();

    const newErrors = {
      name: !name.trim(),
      code: !code.trim(),
      flavor: !flavor.trim(),
      opis: !opis.trim(),
    };

    setErrors(newErrors);

    const missingFields: string[] = [];
    if (newErrors.name) missingFields.push("Nazwa produktu");
    if (newErrors.code) missingFields.push("Kod produktu");
    if (newErrors.flavor) missingFields.push("Smak");
    if (newErrors.opis) missingFields.push("Opis");

    if (missingFields.length > 0) {
      const allButLast = missingFields.slice(0, -1).join(", ");
      const last = missingFields[missingFields.length - 1];
      const fieldsString =
        missingFields.length === 1 ? missingFields[0] : `${allButLast} i ${last}`;
      const prefix = missingFields.length === 1 ? "pole" : "pola";
      showError(`Uzupełnij ${prefix}: ${fieldsString}`);
      return;
    }

    setSaving(true);
    try {
      const res = await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim(),
          flavor: flavor.trim(),
          description: opis.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = Array.isArray(err.message)
          ? err.message[0]
          : err.message || "Błąd zapisu produktu";
        showError(msg);
        return;
      }

      await refreshStats();
      onNavigate("home", { toastMessage: "Pomyślnie dodano produkt do listy" });
    } catch (e) {
      showError("Brak połączenia z serwerem");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[{ flex: 1, transform: [{ translateY: shiftAnim }] }]}
      >
        <HeaderGradientBlock openSidebar={openSidebar} height={scaleH(200)} />
        <View style={[styles.content, { paddingHorizontal }]}>
          <View style={styles.avatarWrapper}>
            <Image
              source={require("../../assets/icons/add-product-icon.webp")}
              style={styles.avatar}
            />
          </View>

          <Text style={styles.name}>Dodaj produkt</Text>

          <AddProductInputs
            setFocusedField={setFocusedField}
            name={name}
            setName={handleChangeName}
            code={code}
            setCode={handleChangeCode}
            flavor={flavor}
            setFlavor={handleChangeFlavor}
            opis={opis}
            setOpis={handleChangeOpis}
            errors={errors}
          />

          <AddButton onPress={handleSaveAndExit} disabled={saving} />
        </View>
      </Animated.View>

      <ToastNotification
        visible={errorToast.visible}
        message={errorToast.message}
        type="error"
        onHide={() => setErrorToast((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  content: { flex: 1, alignItems: "center" },
  avatarWrapper: {
    width: scaleW(84),
    height: scaleW(84),
    borderRadius: scaleW(50),
    backgroundColor: "#0D0D0D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scaleH(15),
    marginTop: -scaleW(42),
    borderWidth: 1,
    borderColor: "rgba(61, 60, 60, 0.67)",
    shadowColor: "rgba(0,0,0,0.45)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatar: { width: scaleW(34), height: scaleW(34) },
  name: {
    color: "#fff",
    fontSize: scaleW(26),
    fontFamily: "Satoshi-Medium",
    lineHeight: 40,
    letterSpacing: scaleW(26) * 0.03,
  },
});

export default AddProductPage;
