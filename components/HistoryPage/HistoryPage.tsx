import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

import HeaderGradientBlock from "../HeaderGradient/HeaderGradientBlock";
import ExportButton from "./comp/ExportButton";
import ProductDayBlock from "./comp/ProductListForDay";
import { useHistory } from "../../context/HistoryContext";
import HistoryFilterModal, { FilterSettings } from "./comp/HistoryFilterModal";
import HistoryQuantityModal from "./comp/HistoryQuantityModal";
import { apiRequest, getToken, API_URL } from "../../services/api";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_WIDTH = 402;
const BASE_HEIGHT = 874;

const scaleW = (size: number) => (size * SCREEN_WIDTH) / BASE_WIDTH;
const scaleH = (size: number) => (size * SCREEN_HEIGHT) / BASE_HEIGHT;

const getDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const d = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  const t = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  const y = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  ).getTime();

  if (d === t) return "Dzisiaj";
  if (d === y) return "Wczoraj";

  return `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}.${date.getFullYear()}`;
};

const HistoryPage: React.FC<{ openSidebar: () => void }> = ({
  openSidebar,
}) => {
  const { historyItems, updateItemQuantity, fetchHistory } = useHistory();
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const [filterVisible, setFilterVisible] = useState(false);
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    sortBy: "newest",
    month: "all",
  });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchHistory(
      filterSettings.sortBy,
      filterSettings.month !== "all" ? filterSettings.month : undefined,
    );
  }, [filterSettings]);

  const [qtyModalVisible, setQtyModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    qty: number;
  } | null>(null);

  const handleOpenQtyModal = (itemId: string, currentQty: number) => {
    setEditingItem({ id: itemId, qty: currentQty });
    setQtyModalVisible(true);
  };

  const handleSaveQty = (newQty: number) => {
    if (editingItem) {
      updateItemQuantity(editingItem.id, newQty);
    }
    setQtyModalVisible(false);
  };

  const handleQuickUpdate = (itemId: string, newQty: number) => {
    updateItemQuantity(itemId, newQty);
  };

  const handleExport = async () => {
    if (selectedGroups.length === 0) return;
    setExporting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/history/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dateKeys: selectedGroups }),
      });
      if (!res.ok) {
        Alert.alert("Błąd", "Nie udało się wyeksportować historii");
        return;
      }
      const blob = await res.blob();
      Alert.alert(
        "Raport gotowy ✅",
        "Plik Excel (.xlsx) z raportem inwentaryzacji został wygenerowany.",
      );
    } catch (e) {
      Alert.alert("Błąd", "Brak połączenia z serwerem");
    } finally {
      setExporting(false);
    }
  };

  const processedItems = useMemo(() => {
    let result = [...historyItems];
    if (filterSettings.month !== "all") {
      result = result.filter((item) => {
        const itemDate = new Date(item.date);
        const year = itemDate.getFullYear();
        const month = String(itemDate.getMonth() + 1).padStart(2, "0");
        return `${year}-${month}` === filterSettings.month;
      });
    }
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filterSettings.sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [historyItems, filterSettings]);

  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: typeof historyItems } = {};
    processedItems.forEach((item) => {
      const dateObj = new Date(item.date);
      const dateKey = `${dateObj.getFullYear()}-${String(
        dateObj.getMonth() + 1,
      ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });
    return Object.keys(groups)
      .sort((a, b) =>
        filterSettings.sortBy === "newest"
          ? new Date(b).getTime() - new Date(a).getTime()
          : new Date(a).getTime() - new Date(b).getTime(),
      )
      .map((dateKey) => ({
        dateKey,
        label: getDateLabel(dateKey),
        items: groups[dateKey],
      }));
  }, [processedItems, filterSettings.sortBy]);

  const toggleGroupSelection = (dateKey: string) => {
    if (selectedGroups.includes(dateKey)) {
      setSelectedGroups(selectedGroups.filter((g) => g !== dateKey));
    } else {
      setSelectedGroups([...selectedGroups, dateKey]);
    }
  };

  const isExportDisabled =
    groupedHistory.length === 0 || selectedGroups.length === 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0D0D0D" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <HeaderGradientBlock openSidebar={openSidebar} height={scaleH(152)} />

          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: scaleW(18),
              paddingBottom: scaleH(140),
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.pageName}>Historia Zapasów</Text>

            <TouchableOpacity
              style={styles.filterContainer}
              activeOpacity={0.7}
              onPress={() => setFilterVisible(true)}
            >
              <Image
                style={styles.filterIcon}
                source={require("../../assets/icons/filter-icon.webp")}
                resizeMode="cover"
              />
              <Text style={styles.filterText}>
                {filterSettings.month !== "all" ? "Filtry (Aktywne)" : "Filtry"}
              </Text>
            </TouchableOpacity>

            {groupedHistory.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Brak historii zapasów</Text>
                {historyItems.length > 0 && (
                  <Text style={styles.emptySubText}>
                    Spróbuj zmienić filtry
                  </Text>
                )}
              </View>
            ) : (
              groupedHistory.map((group) => (
                <ProductDayBlock
                  key={group.dateKey}
                  dayLabel={group.label}
                  items={group.items}
                  onOpenModal={handleOpenQtyModal}
                  onUpdateQuantity={handleQuickUpdate}
                  isSelected={selectedGroups.includes(group.dateKey)}
                  onToggle={() => toggleGroupSelection(group.dateKey)}
                />
              ))
            )}
          </ScrollView>

          {!qtyModalVisible && (
            <ExportButton
              scaleW={scaleW}
              scaleH={scaleH}
              onPress={handleExport}
              disabled={isExportDisabled || exporting}
            />
          )}

          <HistoryFilterModal
            visible={filterVisible}
            onClose={() => setFilterVisible(false)}
            onApply={setFilterSettings}
            currentSettings={filterSettings}
          />

          <HistoryQuantityModal
            visible={qtyModalVisible}
            initial={editingItem?.qty || 1}
            onClose={() => setQtyModalVisible(false)}
            onSubmit={handleSaveQty}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  pageName: {
    color: "#fff",
    fontSize: scaleW(26),
    fontFamily: "Satoshi-Medium",
    lineHeight: 40,
    letterSpacing: scaleW(26) * 0.04,
    marginTop: scaleH(35),
    marginBottom: scaleH(12),
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: scaleH(8),
    paddingHorizontal: scaleW(30),
    borderRadius: scaleW(30),
    marginBottom: scaleH(35),
    backgroundColor: "rgba(13, 13, 13, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  filterText: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: "SF-Pro-Rounded-Bold-Fixed",
    fontSize: scaleW(14),
    letterSpacing: scaleW(14) * 0.04,
  },
  filterIcon: {
    width: scaleW(12),
    height: scaleH(12),
    marginRight: scaleW(7),
    tintColor: "rgba(255,255,255,0.8)",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: scaleW(18),
    fontFamily: "Satoshi-Medium",
  },
  emptySubText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: scaleW(15),
    marginTop: scaleH(6),
    fontFamily: "SF-Pro-Rounded-Regular",
  },
});

export default HistoryPage;
