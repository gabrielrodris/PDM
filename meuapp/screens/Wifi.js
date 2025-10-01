import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Platform } from "react-native";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";

export default function App() {
  const [netInfo, setNetInfo] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Pede permissão de localização (necessário para acessar ssid em Android)
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermissionGranted(status === "granted");
      } catch (e) {
        setPermissionGranted(false);
      }
    })();

    // Subscreve mudanças de rede
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(state);
    });

    // pega o estado atual uma vez
    NetInfo.fetch().then((state) => setNetInfo(state));

    return () => unsubscribe();
  }, []);

  const refresh = async () => {
    const state = await NetInfo.fetch();
    setNetInfo(state);
  };

  const renderContent = () => {
    if (!netInfo) return <Text>Buscando estado da rede...</Text>;

    return (
      <>
        <Text style={styles.line}>
          Conectado: {netInfo.isConnected ? "Sim" : "Não"}
        </Text>
        <Text style={styles.line}>Tipo de conexão: {netInfo.type}</Text>
        <Text style={styles.line}>
          Internet alcançável:{" "}
          {netInfo.isInternetReachable === null
            ? "—"
            : netInfo.isInternetReachable
            ? "Sim"
            : "Não"}
        </Text>

        {/* SSID pode estar dentro de netInfo.details.ssid (ou null). Depende de permissões/plataforma */}
        <Text style={styles.line}>
          SSID:{" "}
          {netInfo.details && netInfo.details.ssid
            ? netInfo.details.ssid
            : "Indisponível / null"}
        </Text>

        {/* Exemplo de campo extra em Android (bssid, strength) se disponível */}
        {netInfo.details && netInfo.details.bssid ? (
          <Text style={styles.line}>BSSID: {netInfo.details.bssid}</Text>
        ) : null}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wi-Fi / Conexão — Status</Text>
      {renderContent()}

      <View style={{ height: 16 }} />
      <Button title="Atualizar" onPress={refresh} />

      <View style={{ height: 16 }} />
      <Text style={styles.small}>
        Permissão de localização:{" "}
        {permissionGranted ? "Concedida" : "Não concedida"}
      </Text>

      <View style={{ height: 8 }} />
      <Text style={styles.note}>
        Observação: para acessar SSID em Android peça permissão de localização;
        em iOS exige configuração adicional (entitlements).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  line: { marginBottom: 8, fontSize: 16 },
  small: { fontSize: 14, marginTop: 8 },
  note: { marginTop: 12, fontSize: 13, color: "#555" },
});
