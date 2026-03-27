 import React, { useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Sidebar from "./components/Sidebar/Sidebar";
import HomePage from "./components/HomePage/HomePage";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import ScannerPage from "./components/ScannerPage/ScannerPage";
import AddProductPage from "./components/AddProductPage/AddProductPage";
import ScanLabelPage from "./components/ScanLabelPage/ScanLabelPage";
import ProductListPage from "./components/ProductListPage/ProductListPage";
import HistoryPage from "./components/HistoryPage/HistoryPage";
import ChangeMailPage from "./components/ProfilePage/comp/ChangeMailPage";
import ChangePasswordPage from "./components/ProfilePage/comp/ChangePasswordPage";
import HelpPage from "./components/ProfilePage/comp/HelpPage";
import ScanResultPage from "./components/ScanResultPage/ScanResultPage";
import LoginPage from "./components/AutorizationPages/Login/LoginPage";
import SignupPage from "./components/AutorizationPages/Signup/SignupPage";
import ToastNotification from "./components/Notifications/ToastNotification";
import { AuthProvider } from "./context/AuthContext";
import { StatsProvider } from "./context/StatsContext";
import { HistoryProvider } from "./context/HistoryContext";

const Stack = createNativeStackNavigator();

const ScreenWrapper = ({ children, openSidebar, onNavigate }) => {
  return React.cloneElement(children, { openSidebar, onNavigate });
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "Satoshi-Variable": require("./assets/fonts/Satoshi-Variable.ttf"),
    "Satoshi-Regular": require("./assets/fonts/Satoshi-Regular.otf"),
    "Satoshi-Medium": require("./assets/fonts/Satoshi-Medium.otf"),
    "Satoshi-Bold": require("./assets/fonts/Satoshi-Bold.otf"),
    "SF-Pro-Rounded-Regular": require("./assets/fonts/SF-Pro-Rounded-Regular.ttf"),
    "SF-Pro-Rounded-Bold-Fixed": require("./assets/fonts/SF-Pro-Rounded-Bold-Fixed.ttf"),
    "SF-Pro-Rounded-Medium": require("./assets/fonts/SF-Pro-Rounded-Medium.ttf"),
    "SF-Pro-Rounded-SemiBold": require("./assets/fonts/SF-Pro-Rounded-SemiBold.ttf"),
  });

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const navigationRef = useRef(null);

  const [toast, setToast] = useState({ visible: false, message: "" });

  const openSidebar = () => setSidebarVisible(true);
  const closeSidebar = () => setSidebarVisible(false);

  const handleNavigate = (screen, params) => {
    setActiveTab(screen);
    navigationRef.current?.navigate(screen, params);
    closeSidebar();

    if (params && params.toastMessage) {
      setToast({ visible: true, message: params.toastMessage });
      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const screens = {
    home: HomePage,
    profile: ProfilePage,
    scanner: ScannerPage,
    addProduct: AddProductPage,
    scanLabel: ScanLabelPage,
    productList: ProductListPage,
    history: HistoryPage,
    ChangeMailPage,
    ChangePasswordPage,
    HelpPage,
    scanResultPage: ScanResultPage,
    login: LoginPage,
    register: SignupPage,
  };

  return (
    <AuthProvider>
      <StatsProvider>
        <HistoryProvider>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="light" />
            <View style={styles.container}>
              <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
                {Object.entries(screens).map(([name, Component]) => (
                  <Stack.Screen key={name} name={name}>
                    {() => (
                      <ScreenWrapper
                        openSidebar={openSidebar}
                        onNavigate={handleNavigate}
                      >
                        <Component />
                      </ScreenWrapper>
                    )}
                  </Stack.Screen>
                ))}
              </Stack.Navigator>

              <Sidebar
                visible={sidebarVisible}
                onClose={closeSidebar}
                activeTab={activeTab}
                onNavigate={handleNavigate}
              />

              <ToastNotification
                visible={toast.visible}
                message={toast.message}
                onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
              />
            </View>
          </NavigationContainer>
        </HistoryProvider>
      </StatsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
  },
});
