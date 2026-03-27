import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from "react-native";
import ProfileButtons from "./comp/ProfileButtons";
import ProfileHeader from "./comp/ProfileHeader";
import { useAuth } from "../../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfilePageProps {
  openSidebar: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ openSidebar }) => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout?.();
    navigation.navigate("home");
  };

  const paddingHorizontal = scaleW(27);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ProfileHeader
        openSidebar={openSidebar}
        height={scaleH(200)}
        onLogout={handleLogout}
      />

      <View style={[styles.content, { paddingHorizontal }]}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require("../../assets/icons/profile-user-icon.webp")}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{user?.role}</Text>
        <ProfileButtons
          onNavigate={(screen: keyof RootStackParamList) =>
            navigation.navigate(screen)
          }
        />
      </View>
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
  avatar: { width: scaleW(36), height: scaleW(36) },
  name: {
    color: "#fff",
    fontSize: scaleW(26),
    fontFamily: "Satoshi-Medium",
    lineHeight: 40,
    letterSpacing: scaleW(26) * 0.03,
    marginBottom: scaleH(1),
  },
  role: {
    color: "#cfcfcf",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    letterSpacing: scaleW(14) * 0.03,
  },
});

export default ProfilePage;
