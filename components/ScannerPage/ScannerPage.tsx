import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import TopButton from "../HomePage/comp/TopButton";
import InfoBlock from "./comp/InfoBlock";
import CameraFrame from "./comp/CameraFrame";
import ScanButton from "./comp/ScanButton";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface ScannerPageProps {
  openSidebar: () => void;
}
type ScanNav = NativeStackNavigationProp<RootStackParamList, "scanner">;

const ScannerPage: React.FC<ScannerPageProps> = ({ openSidebar }) => {
  const navigation = useNavigation<ScanNav>();

  const handleCodeScanned = (code: string) => {
    navigation.navigate("scanResultPage", { productCode: code });
  };

  const handleManualScan = () => {
    navigation.navigate("scanResultPage", { productCode: "DEMO" });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topButtonsContainer}>
          <TopButton
            icon={require("../../assets/icons/menu-icon.webp")}
            iconWidth={16}
            iconHeight={16}
            onPress={openSidebar}
          />

          <View style={styles.rightButtons}>
            <TopButton
              icon={require("../../assets/icons/search-icon.webp")}
              iconWidth={19}
              iconHeight={17}
              onPress={() => navigation.navigate("productList", { focusSearch: true })}
            />
          </View>
        </View>
        <InfoBlock
          title="Zeskanuj kod QR"
          description="Aby szybko znaleźć i wyświetlić szczegóły produktu, zeskanuj przypisany do niego kod QR."
        />
        <CameraFrame onCodeScanned={handleCodeScanned} />
      </View>
      <ScanButton onPress={handleManualScan} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: scaleW(25),
  },

  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: scaleH(78),
    marginBottom: scaleH(50),
  },

  rightButtons: {
    alignItems: "flex-end",
  },
});

export default ScannerPage;
