import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface ProfileButtonsProps {
  onNavigate: (screen: string) => void;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({ onNavigate }) => {
  return (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate("ChangePasswordPage")}
      >
        <Text style={styles.buttonText}>Zmiana hasła</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate("ChangeMailPage")}
      >
        <Text style={styles.buttonText}>Zmiana maila</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate("HelpPage")}
      >
        <Text style={styles.buttonText}>Pomoc</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: scaleH(35),
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    paddingVertical: scaleH(17),
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: scaleW(20),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: scaleH(21),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: scaleW(16),
    fontFamily: "SF-Pro-Rounded-Regular",
    letterSpacing: scaleW(0.5),
    lineHeight: scaleH(21),
  },
});

export default ProfileButtons;
