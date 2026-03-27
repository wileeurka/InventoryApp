import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface AddProductInputsProps {
  setFocusedField: (field: string | null) => void;
  name: string;
  setName: (text: string) => void;
  code: string;
  setCode: (text: string) => void;
  flavor: string;
  setFlavor: (text: string) => void;
  opis: string;
  setOpis: (text: string) => void;
  errors: {
    name: boolean;
    code: boolean;
    flavor: boolean;
    opis: boolean;
  };
}

const AddProductInputs: React.FC<AddProductInputsProps> = ({
  setFocusedField,
  name,
  setName,
  code,
  setCode,
  flavor,
  setFlavor,
  opis,
  setOpis,
  errors,
}) => {
  const [focusedField, setLocalFocus] = useState<string | null>(null);

  const nameRef = useRef<TextInput>(null);
  const codeRef = useRef<TextInput>(null);
  const flavorRef = useRef<TextInput>(null);
  const opisRef = useRef<TextInput>(null);

  const handleWrapperPress = (field: string) => {
    if (field === "name") nameRef.current?.focus();
    if (field === "code") codeRef.current?.focus();
    if (field === "flavor") flavorRef.current?.focus();
    if (field === "opis") opisRef.current?.focus();
  };

  const handleInputFocus = (field: string) => {
    setLocalFocus(field);
    setFocusedField(field);
  };

  const handleBlur = () => {
    setLocalFocus(null);
    setFocusedField(null);
  };

  const renderClearButton = (
    text: string,
    setText: (val: string) => void,
    isLabelRow: boolean = false
  ) => {
    if (!text) return null;

    const buttonStyles: any = isLabelRow
      ? {
          position: "absolute",
          right: 0,
          padding: scaleW(8),
          marginRight: -scaleW(8),
          ...Platform.select({
            ios: { top: scaleH(-5) },
            android: { top: scaleH(-11) },
          }),
        }
      : {
          position: "absolute",
          right: scaleW(10),
          top: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: scaleW(8),
        };

    return (
      <TouchableOpacity onPress={() => setText("")} style={buttonStyles}>
        <Text style={{ color: "white", fontSize: scaleW(18) }}>✕</Text>
      </TouchableOpacity>
    );
  };

  const capitalizeFirstLetter = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* NAME INPUT */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleWrapperPress("name")}
          style={[
            styles.inputWrapper,
            focusedField === "name" && styles.inputWrapperActive,
            errors.name && styles.inputError,
          ]}
        >
          <TextInput
            ref={nameRef}
            placeholder="Nazwa produktu"
            placeholderTextColor={
              errors.name
                ? "rgba(255, 100, 100, 0.6)"
                : focusedField === "name"
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.5)"
            }
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(capitalizeFirstLetter(text))}
            onFocus={() => handleInputFocus("name")}
            onBlur={handleBlur}
            autoCapitalize="words"
          />
          {focusedField === "name" && renderClearButton(name, setName)}
        </TouchableOpacity>

        {/* CODE INPUT */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleWrapperPress("code")}
          style={[
            styles.inputWrapper,
            focusedField === "code" && styles.inputWrapperActive,
            errors.code && styles.inputError,
          ]}
        >
          <TextInput
            ref={codeRef}
            placeholder="Kod produktu"
            placeholderTextColor={
              errors.code
                ? "rgba(255, 100, 100, 0.6)"
                : focusedField === "code"
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.5)"
            }
            style={styles.input}
            value={code}
            onChangeText={setCode}
            onFocus={() => handleInputFocus("code")}
            onBlur={handleBlur}
            keyboardType="default"
            autoCapitalize="characters"
          />
          {focusedField === "code" && renderClearButton(code, setCode)}
        </TouchableOpacity>

        {/* FLAVOR INPUT */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleWrapperPress("flavor")}
          style={[
            styles.inputWrapper,
            focusedField === "flavor" && styles.inputWrapperActive,
            errors.flavor && styles.inputError,
          ]}
        >
          <TextInput
            ref={flavorRef}
            placeholder="Smak"
            placeholderTextColor={
              errors.flavor
                ? "rgba(255, 100, 100, 0.6)"
                : focusedField === "flavor"
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.5)"
            }
            style={styles.input}
            value={flavor}
            onChangeText={(text) => setFlavor(capitalizeFirstLetter(text))}
            onFocus={() => handleInputFocus("flavor")}
            onBlur={handleBlur}
            autoCapitalize="words"
          />
          {focusedField === "flavor" && renderClearButton(flavor, setFlavor)}
        </TouchableOpacity>

        {/* DESCRIPTION INPUT */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleWrapperPress("opis")}
          style={[
            styles.inputWrapper,
            { height: scaleH(174) },
            focusedField === "opis" && styles.inputWrapperActive,
            errors.opis && styles.inputError,
          ]}
        >
          <View
            style={{
              position: "relative",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: scaleH(5),
              minHeight: scaleH(21),
            }}
          >
            <Text
              style={[
                styles.label,
                {
                  color: errors.opis
                    ? "rgba(255, 100, 100, 0.6)"
                    : focusedField === "opis"
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.5)",
                  marginBottom: 0,
                },
              ]}
            >
              Opis towaru
            </Text>
            {focusedField === "opis" &&
              opis.length > 0 &&
              renderClearButton(opis, setOpis, true)}
          </View>

          <View
            style={[
              styles.stroke,
              errors.opis && { backgroundColor: "rgba(231, 76, 60, 0.4)" },
            ]}
          />

          <TextInput
            ref={opisRef}
            multiline
            blurOnSubmit={true}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            placeholderTextColor={
              errors.opis
                ? "rgba(255, 100, 100, 0.6)"
                : focusedField === "opis"
                ? "rgba(255,255,255,0.9)"
                : "rgba(255,255,255,0.4)"
            }
            value={opis}
            onChangeText={(text) => setOpis(capitalizeFirstLetter(text))}
            onFocus={() => handleInputFocus("opis")}
            onBlur={handleBlur}
            style={styles.inputOpis}
            textAlignVertical="top"
            autoCapitalize="sentences"
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scaleH(25),
    width: "100%",
    alignItems: "center",
    flex: 1,
  },
  inputWrapper: {
    width: "100%",
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: scaleW(20),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    paddingHorizontal: scaleW(17),
    paddingVertical: Platform.OS === "android" ? scaleH(15) : scaleH(16),
    marginBottom: scaleH(21),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  inputWrapperActive: {
    backgroundColor: "rgba(35,35,35,0.85)",
    borderColor: "rgba(218,218,218,0.25)",
  },
  inputError: {
    borderColor: "#E74C3C",
    backgroundColor: "rgba(231, 76, 60, 0.15)",
    shadowColor: "#E74C3C",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: {
    color: "rgba(255,255,255,0.9)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Regular",
    letterSpacing: scaleW(0.5),
    ...Platform.select({
      ios: { lineHeight: scaleH(21) },
      android: {
        textAlignVertical: "center",
        paddingVertical: 0,
        includeFontPadding: false,
      },
    }),
  },
  label: {
    color: "rgba(255,255,255,0.9)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Regular",
    letterSpacing: scaleW(0.5),
    lineHeight: scaleH(21),
    marginBottom: scaleH(16),
  },
  stroke: {
    height: 1,
    backgroundColor: "#373737",
    marginBottom: scaleH(8),
    marginTop: scaleH(8),
  },
  inputOpis: {
    color: "rgba(255,255,255,0.9)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Regular",
    letterSpacing: scaleW(0.5),
    lineHeight: scaleH(21),
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    ...Platform.select({
      android: {
        paddingVertical: 0,
        includeFontPadding: false,
        textAlignVertical: "top",
      },
    }),
  },
});

export default AddProductInputs;
