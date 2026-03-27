import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Platform,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

export interface FilterSettings {
  sortBy: "newest" | "oldest";
  month: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (settings: FilterSettings) => void;
  currentSettings: FilterSettings;
}

const getLast12Months = () => {
  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];

  const today = new Date();
  const months = [{ label: "Wszystkie", value: "all" }];

  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    months.push({ label, value });
  }
  return months;
};

const HistoryFilterModal: React.FC<Props> = ({
  visible,
  onClose,
  onApply,
  currentSettings,
}) => {
  const [tempSettings, setTempSettings] =
    useState<FilterSettings>(currentSettings);
  const months = getLast12Months();
  const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setTempSettings(currentSettings);
      panY.setValue(SCREEN_HEIGHT);
      Animated.spring(panY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
        speed: 12,
      }).start();
    }
  }, [visible]);

  const closeWithAnimation = () => {
    Animated.timing(panY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          closeWithAnimation();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    })
  ).current;

  const handleApply = () => {
    onApply(tempSettings);
    closeWithAnimation();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeWithAnimation}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlayWrapper}>
        <TouchableWithoutFeedback onPress={closeWithAnimation}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.container, { transform: [{ translateY: panY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragIndicatorWrapper}>
            <View style={styles.dragIndicator} />
          </View>

          <Text style={styles.headerTitle}>Filtry</Text>

          <Text style={styles.sectionLabel}>Sortowanie</Text>
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.optionButton,
                tempSettings.sortBy === "newest" && styles.optionButtonActive,
              ]}
              onPress={() =>
                setTempSettings({ ...tempSettings, sortBy: "newest" })
              }
            >
              <Text
                style={[
                  styles.optionText,
                  tempSettings.sortBy === "newest" && styles.optionTextActive,
                ]}
              >
                Od najnowszych
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.optionButton,
                tempSettings.sortBy === "oldest" && styles.optionButtonActive,
              ]}
              onPress={() =>
                setTempSettings({ ...tempSettings, sortBy: "oldest" })
              }
            >
              <Text
                style={[
                  styles.optionText,
                  tempSettings.sortBy === "oldest" && styles.optionTextActive,
                ]}
              >
                Od najstarszych
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionLabel}>Wybierz okres</Text>

          <View style={styles.gridContainer}>
            {months.map((m) => {
              const isActive = tempSettings.month === m.value;
              return (
                <TouchableOpacity
                  key={m.value}
                  activeOpacity={0.7}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() =>
                    setTempSettings({ ...tempSettings, month: m.value })
                  }
                >
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Zastosuj</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlayWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  container: {
    backgroundColor: "#161616",
    borderTopLeftRadius: scaleW(35),
    borderTopRightRadius: scaleW(35),
    paddingHorizontal: scaleW(25),
    paddingBottom: Platform.select({ ios: scaleH(40), android: scaleH(60) }),
    paddingTop: scaleH(10),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderBottomWidth: 0,
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  dragIndicatorWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: scaleH(15),
  },
  dragIndicator: {
    width: scaleW(40),
    height: scaleH(4),
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
  },
  headerTitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: scaleW(24),
    fontFamily: "Satoshi-Medium",
    marginBottom: scaleH(25),
    textAlign: "center",
  },
  sectionLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: scaleW(13),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    marginBottom: scaleH(12),
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    gap: scaleW(10),
    marginBottom: scaleH(30),
    alignItems: "stretch",
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#222",
    paddingVertical: scaleH(14),
    borderRadius: scaleW(16),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  optionButtonActive: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderColor: "#fff",
  },
  optionText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: scaleW(15),
    fontFamily: "SF-Pro-Rounded-Medium",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  optionTextActive: {
    color: "#000",
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scaleW(10),
    marginBottom: scaleH(35),
  },
  chip: {
    paddingHorizontal: scaleW(16),
    paddingVertical: scaleH(10),
    borderRadius: scaleW(20),
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderColor: "#fff",
  },
  chipText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: scaleW(13),
    fontFamily: "SF-Pro-Rounded-Medium",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  chipTextActive: {
    color: "#000",
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
  },
  applyButton: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: scaleW(30),
    paddingVertical: scaleH(18),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  applyButtonText: {
    color: "#000",
    fontSize: scaleW(18),
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
  },
});

export default HistoryFilterModal;
