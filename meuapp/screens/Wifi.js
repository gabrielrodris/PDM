import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function App() {
  const [netInfo, setNetInfo] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermissionGranted(status === "granted");

        // Animações após carregar
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (e) {
        setPermissionGranted(false);
      }
    };

    initializeApp();

    // Subscreve mudanças de rede
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(state);
      // Animação de pulso quando a rede muda
      startPulse();
    });

    // Pega o estado atual uma vez
    NetInfo.fetch().then((state) => setNetInfo(state));

    return () => unsubscribe();
  }, []);

  const startPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const refresh = async () => {
    startPulse();
    const state = await NetInfo.fetch();
    setNetInfo(state);
  };

  const getConnectionIcon = () => {
    if (!netInfo) return "help-circle";
    if (!netInfo.isConnected) return "wifi-off";

    switch (netInfo.type) {
      case "wifi":
        return "wifi";
      case "cellular":
        return "cellular";
      case "ethernet":
        return "desktop";
      case "bluetooth":
        return "bluetooth";
      case "vpn":
        return "shield-checkmark";
      default:
        return "globe";
    }
  };

  const getConnectionColor = () => {
    if (!netInfo || !netInfo.isConnected) return "#ff6b6b";
    if (!netInfo.isInternetReachable) return "#ffd93d";
    return "#4ecdc4";
  };

  const getSignalStrength = () => {
    if (!netInfo?.details?.strength) return null;

    const strength = netInfo.details.strength;
    const bars = Math.ceil((strength + 100) / 25); // Convert to 1-4 bars
    return Array.from({ length: 4 }, (_, i) => (
      <View
        key={i}
        style={[
          styles.signalBar,
          {
            backgroundColor: i < bars ? getConnectionColor() : "#ccc",
            height: 8 + i * 4,
          },
        ]}
      />
    ));
  };

  const InfoCard = ({ title, value, icon, color = "#4ecdc4" }) => (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Ionicons name="wifi" size={40} color="#4ecdc4" />
        <Text style={styles.title}>Monitor de Rede</Text>
        <Text style={styles.subtitle}>Status completo da conexão</Text>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Principal */}
        <Animated.View
          style={[
            styles.statusSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.statusCard,
              {
                transform: [{ scale: pulseAnim }],
                borderColor: getConnectionColor(),
              },
            ]}
          >
            <View style={styles.statusHeader}>
              <Ionicons
                name={getConnectionIcon()}
                size={32}
                color={getConnectionColor()}
              />
              <View style={styles.statusTexts}>
                <Text style={styles.statusTitle}>
                  {!netInfo
                    ? "Verificando..."
                    : !netInfo.isConnected
                    ? "Sem Conexão"
                    : netInfo.type.toUpperCase()}
                </Text>
                <Text
                  style={[
                    styles.statusSubtitle,
                    { color: getConnectionColor() },
                  ]}
                >
                  {!netInfo
                    ? "⏳"
                    : !netInfo.isConnected
                    ? "🔴 Offline"
                    : !netInfo.isInternetReachable
                    ? "🟡 Conexão Limitada"
                    : "🟢 Online"}
                </Text>
              </View>
            </View>

            {/* Signal Strength */}
            {netInfo?.type === "wifi" && (
              <View style={styles.signalContainer}>
                <Text style={styles.signalLabel}>Força do Sinal:</Text>
                <View style={styles.signalBars}>{getSignalStrength()}</View>
              </View>
            )}
          </Animated.View>
        </Animated.View>

        {/* Informações Detalhadas */}
        <Animated.View
          style={[
            styles.infoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Detalhes da Conexão</Text>

          <View style={styles.infoGrid}>
            <InfoCard
              title="Status"
              value={netInfo?.isConnected ? "Conectado" : "Desconectado"}
              icon="power"
              color={netInfo?.isConnected ? "#4ecdc4" : "#ff6b6b"}
            />

            <InfoCard
              title="Tipo"
              value={netInfo?.type || "Desconhecido"}
              icon="hardware-chip"
            />

            <InfoCard
              title="Internet"
              value={
                netInfo?.isInternetReachable === null
                  ? "—"
                  : netInfo?.isInternetReachable
                  ? "Acessível"
                  : "Inacessível"
              }
              icon="globe"
              color={
                netInfo?.isInternetReachable === null
                  ? "#888"
                  : netInfo?.isInternetReachable
                  ? "#4ecdc4"
                  : "#ffd93d"
              }
            />

            <InfoCard
              title="Rede Wi-Fi"
              value={
                netInfo?.details?.ssid ||
                (netInfo?.type === "wifi" ? "Oculto" : "N/A")
              }
              icon="business"
            />
          </View>

          {/* Informações Técnicas */}
          {netInfo?.details && (
            <View style={styles.techSection}>
              <Text style={styles.techTitle}>Informações Técnicas</Text>

              {netInfo.details.bssid && (
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>BSSID:</Text>
                  <Text style={styles.techValue}>{netInfo.details.bssid}</Text>
                </View>
              )}

              {netInfo.details.ipAddress && (
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>IP Address:</Text>
                  <Text style={styles.techValue}>
                    {netInfo.details.ipAddress}
                  </Text>
                </View>
              )}

              {netInfo.details.strength && (
                <View style={styles.techItem}>
                  <Text style={styles.techLabel}>Intensidade:</Text>
                  <Text style={styles.techValue}>
                    {netInfo.details.strength} dBm
                  </Text>
                </View>
              )}
            </View>
          )}
        </Animated.View>

        {/* Permissões */}
        <Animated.View
          style={[
            styles.permissionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.permissionCard}>
            <Ionicons
              name={permissionGranted ? "checkmark-circle" : "close-circle"}
              size={24}
              color={permissionGranted ? "#4ecdc4" : "#ff6b6b"}
            />
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>
                Permissão de Localização
              </Text>
              <Text style={styles.permissionStatus}>
                {permissionGranted ? "Concedida" : "Não Concedida"}
              </Text>
            </View>
          </View>

          <Text style={styles.note}>
            📍 Para acessar SSID em Android é necessária permissão de
            localização. Em iOS exige configuração adicional de entitlements.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Refresh Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
          <Ionicons name="refresh" size={20} color="#ffffff" />
          <Text style={styles.refreshText}>Atualizar Status</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  statusSection: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  statusCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    padding: 25,
    borderWidth: 2,
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statusTexts: {
    marginLeft: 15,
    flex: 1,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  signalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  signalLabel: {
    color: "#888",
    fontSize: 14,
  },
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },
  signalBar: {
    width: 6,
    borderRadius: 2,
  },
  infoSection: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 15,
    flex: 1,
    minWidth: width * 0.4,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  techSection: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 20,
  },
  techTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  techItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  techLabel: {
    color: "#888",
    fontSize: 14,
  },
  techValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  permissionSection: {
    paddingHorizontal: 25,
  },
  permissionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  permissionText: {
    marginLeft: 12,
    flex: 1,
  },
  permissionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  permissionStatus: {
    color: "#888",
    fontSize: 14,
  },
  note: {
    color: "#666",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#2d2d44",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4ecdc4",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  refreshText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
