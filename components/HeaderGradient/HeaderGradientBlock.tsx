import React from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import TopButton from "../HomePage/comp/TopButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

interface HeaderGradientBlockProps {
  openSidebar: () => void;
  height?: number;
}

const HeaderGradientBlock: React.FC<HeaderGradientBlockProps> = ({
  openSidebar,
  height = scaleH(366),
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={[styles.headerContainer, { height }]}>
      <Image
        style={styles.gradientBg}
        source={require("../../assets/images/dark-gradient-bg.webp")}
        resizeMode="cover"
      />
      <View style={styles.inner}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: SCREEN_WIDTH,
    overflow: "hidden",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.25,
    shadowRadius: 17.1,
    elevation: 9,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  inner: {
    flex: 1,
    paddingHorizontal: scaleW(25),
    marginTop: scaleH(78),
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rightButtons: {
    alignItems: "flex-end",
  },
});

export default HeaderGradientBlock;
