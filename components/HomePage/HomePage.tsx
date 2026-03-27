import React from "react";
import { View, StyleSheet, Dimensions, StatusBar } from "react-native";
import MenuButton from "./comp/MenuButton";
import GradientTopContent from "./comp/GradientTopContent";
import { useAuth } from "../../context/AuthContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / 874;

interface HomePageProps {
  openSidebar: () => void;
  onNavigate: (screen: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ openSidebar, onNavigate }) => {
  const paddingHorizontal = scaleW(25);
  const gap = 20;
  const blocksPerRow = 2;
  const blockWidth =
    (SCREEN_WIDTH - paddingHorizontal * 2 - gap * (blocksPerRow - 1)) /
    blocksPerRow;
  const topContentHeight = scaleH(366);
  const totalBlocksHeight = blockWidth * 2 + gap;
  const marginTopBlocks =
    (SCREEN_HEIGHT - topContentHeight - totalBlocksHeight) / 2;

  const { user } = useAuth();

  const routes = ["scanner", "productList", "addProduct", "history"];

  const handlePress = (route: string) => {
    if (!user) {
      onNavigate("login");
    } else {
      onNavigate(route);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <GradientTopContent openSidebar={openSidebar} />

      <View
        style={[
          styles.menuButtons,
          { paddingHorizontal, marginTop: marginTopBlocks },
        ]}
      >
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              width: blockWidth,
              height: blockWidth,
              marginBottom: i < 2 ? gap : 0,
            }}
          >
            <MenuButton
              index={i}
              width={blockWidth}
              height={blockWidth}
              onPress={() => handlePress(routes[i])}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  menuButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default HomePage;
