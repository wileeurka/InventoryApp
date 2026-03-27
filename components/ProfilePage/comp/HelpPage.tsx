import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import HeaderGradientBlock from "../../HeaderGradient/HeaderGradientBlock";
import { useNavigation } from "@react-navigation/native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const { width: W, height: H } = Dimensions.get("window");
const scaleW = (n: number) => (n * W) / 402;
const scaleH = (n: number) => (n * H) / 874;

interface HelpPageProps {
  openSidebar?: () => void;
}

const FAQ_ITEMS = [
  {
    q: "Jak dodać nowy produkt?",
    a: 'Przejdź do zakładki „Dodaj produkt" w menu bocznym lub użyj przycisku skanera. Wypełnij wymagane pola (nazwa, kod, ilość) i naciśnij „Zapisz".',
  },
  {
    q: "Jak zeskanować kod kreskowy?",
    a: "Dotknij ikony skanera w dolnym pasku nawigacji. Skieruj kamerę na kod kreskowy — aplikacja automatycznie go rozpozna i przejdzie do ekranu wyniku.",
  },
  {
    q: "Jak przeglądać historię operacji?",
    a: 'Otwórz menu boczne i wybierz opcję „Historia". Zobaczysz chronologiczną listę wszystkich operacji magazynowych z datami i użytkownikami.',
  },
  {
    q: "Co zrobić, gdy zapomnę hasła?",
    a: 'Na ekranie logowania naciśnij „Zapomniałem hasła". Wyślemy link do resetowania na adres e-mail przypisany do Twojego konta.',
  },
  {
    q: "Jak zmienić adres e-mail konta?",
    a: 'Przejdź do Profilu → „Zmiana maila". Wpisz nowy adres e-mail i potwierdź aktualnym hasłem. Zmiana zostanie zapisana natychmiast.',
  },
  {
    q: "Jak wyeksportować raport magazynu?",
    a: "W widoku listy produktów naciśnij przycisk eksportu (ikona w górnym pasku). Raport zostanie wygenerowany jako plik .xlsx i udostępniony do pobrania.",
  },
];

const QUICK_STEPS = [
  { num: "1", text: "Zaloguj się swoimi danymi" },
  { num: "2", text: "Skanuj lub wyszukaj produkt" },
  { num: "3", text: "Edytuj stan i zapisz zmiany" },
  { num: "4", text: "Przeglądaj historię operacji" },
];

const SectionLabel = ({ children }: { children: string }) => (
  <Text style={styles.sectionLabel}>{children}</Text>
);

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
  isLast,
}) => (
  <>
    <TouchableOpacity
      style={styles.accordionRow}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Text style={styles.accordionQ} numberOfLines={isOpen ? undefined : 2}>
        {question}
      </Text>
      <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>›</Text>
    </TouchableOpacity>

    {isOpen && (
      <View style={styles.accordionAnswer}>
        <Text style={styles.accordionA}>{answer}</Text>
      </View>
    )}

    {!isLast && <View style={styles.divider} />}
  </>
);

const HelpPage: React.FC<HelpPageProps> = ({ openSidebar }) => {
  const navigation = useNavigation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <HeaderGradientBlock
        openSidebar={openSidebar || (() => {})}
        height={scaleH(200)}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Pomoc</Text>
        <Text style={styles.subtitle}>
          Znajdź odpowiedzi na najczęstsze pytania lub skontaktuj się z nami
        </Text>

        <SectionLabel>Szybki start</SectionLabel>
        <View style={styles.card}>
          {QUICK_STEPS.map((step, i) => (
            <React.Fragment key={i}>
              {i !== 0 && <View style={styles.divider} />}
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNum}>{step.num}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <SectionLabel>Najczęstsze pytania</SectionLabel>
        <View style={styles.card}>
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              question={item.q}
              answer={item.a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              isLast={i === FAQ_ITEMS.length - 1}
            />
          ))}
        </View>

        <SectionLabel>Kontakt</SectionLabel>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL("mailto:support@inventoryapp.pl")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.contactBadge,
                { backgroundColor: "rgba(100,200,255,0.18)" },
              ]}
            >
              <Text style={styles.contactEmoji}>✉️</Text>
            </View>
            <View style={styles.contactTexts}>
              <Text style={styles.contactLabel}>E-mail</Text>
              <Text style={styles.contactValue}>support@inventoryapp.pl</Text>
            </View>
            <Text style={styles.contactArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL("tel:+48123456789")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.contactBadge,
                { backgroundColor: "rgba(160,255,100,0.18)" },
              ]}
            >
              <Text style={styles.contactEmoji}>📞</Text>
            </View>
            <View style={styles.contactTexts}>
              <Text style={styles.contactLabel}>Telefon</Text>
              <Text style={styles.contactValue}>+48 123 456 789</Text>
            </View>
            <Text style={styles.contactArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.contactRow}>
            <View
              style={[
                styles.contactBadge,
                { backgroundColor: "rgba(255,200,100,0.18)" },
              ]}
            >
              <Text style={styles.contactEmoji}>🕐</Text>
            </View>
            <View style={styles.contactTexts}>
              <Text style={styles.contactLabel}>Godziny wsparcia</Text>
              <Text style={styles.contactValue}>Pon–Pt, 08:00–17:00</Text>
            </View>
          </View>
        </View>

        <SectionLabel>Informacje o aplikacji</SectionLabel>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Wersja</Text>
            <Text style={styles.infoVal}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Platforma</Text>
            <Text style={styles.infoVal}>
              {Platform.OS === "ios" ? "iOS" : "Android"}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Producent</Text>
            <Text style={styles.infoVal}>InventoryApp sp. z o.o.</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>Wróć do profilu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  scroll: {
    paddingHorizontal: scaleW(25),
    paddingBottom: scaleH(60),
  },

  title: {
    color: "#fff",
    fontSize: scaleW(26),
    fontFamily: "Satoshi-Bold",
    textAlign: "center",
    marginTop: scaleH(30),
    marginBottom: scaleH(8),
    letterSpacing: scaleW(26) * 0.04,
  },
  subtitle: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(13),
    textAlign: "center",
    marginBottom: scaleH(32),
    letterSpacing: 0.3,
    lineHeight: scaleH(20),
    paddingHorizontal: scaleW(20),
  },

  sectionLabel: {
    color: "rgba(255,255,255,0.3)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(11),
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: scaleH(10),
    marginLeft: scaleW(4),
  },

  card: {
    backgroundColor: "rgba(21,21,21,0.75)",
    borderRadius: scaleW(20),
    borderWidth: 1,
    borderColor: "rgba(218,218,218,0.08)",
    paddingHorizontal: scaleW(16),
    paddingVertical: scaleH(6),
    marginBottom: scaleH(28),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    width: "100%",
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    height: scaleH(56),
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNum: {
    color: "rgba(255,255,255,0.55)",
    fontFamily: "Satoshi-Bold",
    fontSize: scaleW(13),
  },
  stepText: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(15),
    marginLeft: scaleW(14),
    flex: 1,
  },

  accordionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scaleH(16),
    minHeight: scaleH(56),
  },
  accordionQ: {
    flex: 1,
    color: "rgba(255,255,255,0.82)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(15),
    lineHeight: scaleH(21),
    paddingRight: scaleW(8),
  },
  chevron: {
    color: "rgba(255,255,255,0.3)",
    fontSize: scaleW(22),
    transform: [{ rotate: "0deg" }],
    lineHeight: scaleW(24),
  },
  chevronOpen: {
    transform: [{ rotate: "90deg" }],
    color: "rgba(255,255,255,0.65)",
  },
  accordionAnswer: {
    paddingBottom: scaleH(14),
    paddingRight: scaleW(26),
  },
  accordionA: {
    color: "rgba(255,255,255,0.45)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(13.5),
    lineHeight: scaleH(20),
    letterSpacing: 0.2,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    height: scaleH(66),
  },
  contactBadge: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    justifyContent: "center",
    alignItems: "center",
  },
  contactEmoji: {
    fontSize: scaleW(17),
  },
  contactTexts: {
    flex: 1,
    marginLeft: scaleW(14),
  },
  contactLabel: {
    color: "rgba(255,255,255,0.35)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(11.5),
    letterSpacing: 0.3,
  },
  contactValue: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14.5),
    marginTop: 2,
  },
  contactArrow: {
    color: "rgba(255,255,255,0.25)",
    fontSize: scaleW(22),
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: scaleH(52),
  },
  infoKey: {
    color: "rgba(255,255,255,0.4)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14.5),
  },
  infoVal: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14.5),
  },

  backBtn: {
    alignItems: "center",
    marginTop: scaleH(4),
    paddingVertical: scaleH(12),
  },
  backText: {
    color: "rgba(255,255,255,0.3)",
    fontFamily: "SF-Pro-Rounded-Regular",
    fontSize: scaleW(14),
    letterSpacing: 0.5,
  },
});

export default HelpPage;
