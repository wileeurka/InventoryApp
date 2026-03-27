import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  activeTab: string;
  onNavigate: (screen: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  visible,
  onClose,
  activeTab,
  onNavigate,
}) => {
  const slideAnim = useRef(new Animated.Value(-scaleW(276))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isMounted, setIsMounted] = useState(visible);
  const { user } = useAuth();
  const protectedRoutes = [
    "scanner",
    "scanLabel",
    "addProduct",
    "productList",
    "history",
  ];

  const menuItems = [
    {
      key: "home",
      label: "Strona domowa",
      icon: require("../../assets/icons/sidebar/sidebar-home-icon.webp"),
      iconWhite: require("../../assets/icons/sidebar/active/sidebar-home-icon-white.webp"),
    },
    {
      key: "scanner",
      label: "Skaner",
      icon: require("../../assets/icons/sidebar/sidebar-scanner-icon.webp"),
      iconWhite: require("../../assets/icons/sidebar/active/sidebar-scanner-icon-white.webp"),
    },
    {
      key: "scanLabel",
      label: "Skanuj etykietkę",
      icon: require("../../assets/icons/sidebar/sidebar-label-icon.webp"),
      iconWhite: require("../../assets/icons/sidebar/active/sidebar-label-icon-white.webp"),
    },
    {
      key: "addProduct",
      label: "Dodaj produkt",
      icon: require("../../assets/icons/sidebar/sidebar-add-icon.webp"),
      iconWhite: require("../../assets/icons/sidebar/active/sidebar-add-icon-white.webp"),
    },
    {
      key: "productList",
      label: "Lista produktów",
      icon: require("../../assets/icons/sidebar/sidebar-list-icon.webp"),
      iconWhite: require("../../assets/icons/sidebar/active/sidebar-list-icon-white.webp"),
    },
    {
      key: "history",
      label: "Historia zapasów",
      icon: require("../../assets/icons/sidebar/sidebar-history-icon.webp"),
      iconWhite: require("../../assets/icons/sidebar/active/sidebar-history-icon-white.webp"),
    },
  ];

  useEffect(() => {
    if (visible) setIsMounted(true);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : -scaleW(276),
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: visible ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!visible) setIsMounted(false);
    });
  }, [visible]);

  if (!isMounted) return null;

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.contentWrapper}>
          {user ? (
            <TouchableOpacity
              style={styles.profile}
              onPress={() => {
                onNavigate("profile");
                onClose();
              }}
            >
              <View style={styles.profileIconWrapper}>
                <Image
                  source={require("../../assets/icons/sidebar/sidebar-profile-icon.webp")}
                  style={styles.profileIcon}
                />
              </View>
              <View style={styles.profileText}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.role}>{user.role}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.profile}
              onPress={() => {
                onNavigate("login");
                onClose();
              }}
            >
              <View style={styles.loginWrapper}>
                <Text style={styles.loginText}>Zaloguj się</Text>
                <Text style={styles.role}>
                  aby uzyskać pełny dostęp do aplikacji
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.menu}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => {
                    if (protectedRoutes.includes(item.key) && !user) {
                      onNavigate("login");
                    } else {
                      onNavigate(item.key);
                    }
                    onClose();
                  }}
                >
                  <Image
                    source={isActive ? item.iconWhite : item.icon}
                    style={styles.menuItemIcon}
                  />
                  <Text
                    style={[
                      styles.menuText,
                      {
                        color: isActive ? "#fff" : "rgba(255,255,255,0.8)",
                        fontFamily: isActive
                          ? "SF-Pro-Rounded-Medium"
                          : "SF-Pro-Rounded-Regular",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "black",
    zIndex: 99,
    elevation: 99,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
    elevation: 100,
    width: scaleW(276),
    height: SCREEN_HEIGHT,
    backgroundColor: "#121212",
    borderTopRightRadius: scaleW(25),
    borderBottomRightRadius: scaleW(25),
    paddingHorizontal: scaleW(25),
  },
  contentWrapper: { flex: 1, justifyContent: "center" },
  profile: {
    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(61,60,60,0.67)",
    borderRadius: scaleW(20),
    padding: scaleW(15),
    marginBottom: scaleH(25),
    backgroundColor: "#0D0D0D",
  },
  profileIconWrapper: {
    width: scaleW(36),
    height: scaleW(36),
    borderRadius: scaleW(18),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scaleW(12),
  },
  profileIcon: { width: scaleW(18), height: scaleW(19) },
  profileText: {
    flexShrink: 1,
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: scaleW(180),
  },
  name: {
    color: "#fff",
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    fontSize: scaleW(16),

    marginBottom: scaleH(2),
    flexWrap: "wrap",
  },
  role: {
    color: "#aaa",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(12),
    letterSpacing: scaleW(12) * 0.02,
    marginTop: scaleH(2),
  },
  loginWrapper: {
    flexDirection: "column",
    maxWidth: scaleW(180),
  },
  loginText: {
    color: "#fff",
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    fontSize: scaleW(16),
    marginBottom: scaleH(3),
  },
  menu: { alignItems: "flex-start" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scaleW(14),
    paddingVertical: scaleH(15),
    marginBottom: scaleH(5),
  },
  menuItemActive: {
    backgroundColor: "#0D0D0D",
    borderWidth: 1,
    borderColor: "rgba(61,60,60,0.67)",
    borderRadius: scaleW(20),
    width: "100%",
    paddingHorizontal: scaleW(14),
    paddingVertical: scaleH(15),
  },
  menuItemIcon: {
    width: scaleW(18),
    height: scaleW(18),
    marginRight: scaleW(10),
  },
  menuText: {
    fontSize: scaleW(16),
    lineHeight: scaleH(20),
    letterSpacing: scaleW(16) * 0.02,
  },
});

export default Sidebar;
