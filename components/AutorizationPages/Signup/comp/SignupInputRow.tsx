import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");
const scaleW = (n: number) => (n * W) / 402;
const scaleH = (n: number) => (n * H) / 874;

interface SignupInputRowProps {
  nameValue?: string;
  onNameChange?: (text: string) => void;
  emailValue: string;
  onEmailChange: (text: string) => void;
  passValue: string;
  onPassChange: (text: string) => void;
  onFocusName?: () => void;
  onBlurName?: () => void;
  onFocusEmail?: () => void;
  onBlurEmail?: () => void;
  onFocusPassword?: () => void;
  onBlurPassword?: () => void;
}

export default function SignupInputRow({
  nameValue,
  onNameChange,
  emailValue,
  onEmailChange,
  passValue,
  onPassChange,
  onFocusName,
  onBlurName,
  onFocusEmail,
  onBlurEmail,
  onFocusPassword,
  onBlurPassword,
}: SignupInputRowProps) {
  const [hidden, setHidden] = useState(true);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.row, { marginBottom: scaleH(6) }]}>
        <View
          style={[
            styles.leftIconWrapper,
            { backgroundColor: "rgba(100,200,255,0.35)" },
          ]}
        >
          <Image
            source={require("../../../../assets/icons/auth/name-icon.webp")}
            style={styles.leftIcon}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Imię i nazwisko"
          placeholderTextColor={
            nameFocused ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"
          }
          value={nameValue}
          onChangeText={onNameChange}
          onFocus={() => {
            setNameFocused(true);
            onFocusName && onFocusName();
          }}
          onBlur={() => {
            setNameFocused(false);
            onBlurName && onBlurName();
          }}
        />
      </View>

      <View style={styles.horizontalDivider} />

      <View style={[styles.row, { marginVertical: scaleH(6) }]}>
        <View
          style={[
            styles.leftIconWrapper,
            { backgroundColor: "rgba(100,255,200,0.35)" },
          ]}
        >
          <Image
            source={require("../../../../assets/icons/auth/email-icon.webp")}
            style={styles.leftIcon}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={
            emailFocused ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"
          }
          value={emailValue}
          onChangeText={onEmailChange}
          onFocus={() => {
            setEmailFocused(true);
            onFocusEmail && onFocusEmail();
          }}
          onBlur={() => {
            setEmailFocused(false);
            onBlurEmail && onBlurEmail();
          }}
        />
      </View>

      <View style={styles.horizontalDivider} />

      <View style={[styles.row, { marginTop: scaleH(6) }]}>
        <View
          style={[
            styles.leftIconWrapper,
            { backgroundColor: "rgba(160,100,255,0.35)" },
          ]}
        >
          <Image
            source={require("../../../../assets/icons/auth/password-icon.webp")}
            style={styles.leftIcon}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Hasło"
          placeholderTextColor={
            passFocused ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)"
          }
          secureTextEntry={hidden}
          value={passValue}
          onChangeText={onPassChange}
          onFocus={() => {
            setPassFocused(true);
            onFocusPassword && onFocusPassword();
          }}
          onBlur={() => {
            setPassFocused(false);
            onBlurPassword && onBlurPassword();
          }}
        />
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setHidden(!hidden)}
          activeOpacity={0.6}
        >
          <Image
            source={
              hidden
                ? require("../../../../assets/icons/auth/close-eye-icon.webp")
                : require("../../../../assets/icons/auth/open-eye-icon.webp")
            }
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
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

  horizontalDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    width: "100%",
  },

  leftIconWrapper: {
    width: 37,
    height: 37,
    borderRadius: 37 / 2,
    justifyContent: "center",
    alignItems: "center",
  },

  leftIcon: {
    width: scaleW(18),
    height: scaleW(18),
  },

  input: {
    flex: 1,
    marginLeft: scaleW(16),
    color: "rgba(255,255,255,0.8)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Regular",
  },

  eyeBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },

  eyeIcon: {
    width: scaleW(18),
    height: scaleW(18),
  },
});
