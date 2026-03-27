import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { useStats } from "../../../context/StatsContext";

const { width, height } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * width) / BASE_WIDTH;
const scaleH = (size: number) => (size * height) / BASE_HEIGHT;

const FastViewBlock = () => {
  const { articlesCount, scannedCount } = useStats();

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={styles.title}>Szybki pogląd</Text>

        <View style={styles.bottomSection}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{articlesCount}</Text>
              <Text style={styles.statLabel}>Liczba artykułów</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{scannedCount}</Text>
              <Text style={styles.statLabel}>Zeskanowano</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: scaleH(140),
    justifyContent: "center",
    alignItems: "center",
    marginTop: -scaleH(1),
  },
  block: {
    width: scaleW(354),
    height: scaleH(86),
    borderRadius: scaleW(28),
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "rgba(61, 60, 60, 0.67)",
    shadowColor: "rgba(0, 0, 0, 0.45)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    paddingHorizontal: scaleW(20),
    paddingVertical: scaleW(15),
    justifyContent: "space-between",
  },
  title: {
    fontSize: scaleW(13),
    lineHeight: scaleH(21),
    letterSpacing: 0.6,
    color: "#A8A8A8",
    fontFamily: "SF-Pro-Rounded-Regular",
    marginBottom: -scaleH(15),
  },
  bottomSection: {
    justifyContent: "flex-end",
  },
  statsRow: {
    height: scaleH(40),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: scaleW(20),
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    fontSize: scaleW(20),
    letterSpacing: 0.5,
    color: "#FFFFFF",
    marginBottom: scaleH(3),
  },
  statLabel: {
    fontFamily: "SF-Pro-Rounded-Medium",
    fontSize: scaleW(10),
    letterSpacing: 0.5,
    color: "#fff",
  },
});

export default FastViewBlock;
