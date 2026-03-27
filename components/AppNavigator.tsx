import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomePage from "./HomePage/HomePage";
import ProfilePage from "./ProfilePage/ProfilePage";
import ScannerPage from "./ScannerPage/ScannerPage";
import AddProductPage from "./AddProductPage/AddProductPage";
import ScanLabelPage from "./ScanLabelPage/ScanLabelPage";
import ProductListPage from "./ProductListPage/ProductListPage";
import HistoryPage from "./HistoryPage/HistoryPage";
import ScanResultPage from "./ScanResultPage/ScanResultPage";
import LoginPage from "./AutorizationPages/Login/LoginPage";

export type RootStackParamList = {
  home: undefined;
  profile: undefined;
  scanner: undefined;
  addProduct: undefined;
  scanLabel: undefined;
  productList: undefined;
  history: undefined;
  scanResultPage: undefined;
  login: undefined;
};

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" component={HomePage} />
        <Stack.Screen name="profile" component={ProfilePage} />
        <Stack.Screen name="scanner" component={ScannerPage} />
        <Stack.Screen name="scanLabel" component={ScanLabelPage} />
        <Stack.Screen name="addProduct" component={AddProductPage} />
        <Stack.Screen name="productList" component={ProductListPage} />
        <Stack.Screen name="history" component={HistoryPage} />
        <Stack.Screen name="scanResultPage" component={ScanResultPage} />
        <Stack.Screen name="login" component={LoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
