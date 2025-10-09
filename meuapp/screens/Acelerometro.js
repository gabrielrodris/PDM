import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  FlatList,
} from "react-native";
import { Accelerometer } from "expo-sensors";

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState([]);

  const LIMIT = 2.5; // 🚨 Limite de aceleração para alerta

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);

        const total =
          Math.sqrt(
            accelerometerData.x ** 2 +
              accelerometerData.y ** 2 +
              accelerometerData.z ** 2
          ) || 0;

        // ⚠️ Verifica se ultrapassou o limite
        if (total > LIMIT) {
          Alert.alert(
            "⚠️ Movimento brusco detectado!",
            `Aceleração total: ${total.toFixed(2)}`
          );
        }

        // 📜 Atualiza histórico (mantém no máximo 10)
        setHistory((prev) => {
          const updated = [
            {
              id: Date.now().toString(),
              x: accelerometerData.x.toFixed(2),
              y: accelerometerData.y.toFixed(2),
              z: accelerometerData.z.toFixed(2),
            },
            ...prev,
          ];
          return updated.slice(0, 10);
        });
      })
    );

    Accelerometer.setUpdateInterval(500);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const toggleSubscription = () => {
    if (isPaused) {
      _subscribe();
    } else {
      _unsubscribe();
    }
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  let { x, y, z } = data;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Leitura do Acelerômetro</Text>

      <View style={styles.dataBox}>
        <Text style={styles.text}>Eixo X: {x.toFixed(2)}</Text>
        <Text style={styles.text}>Eixo Y: {y.toFixed(2)}</Text>
        <Text style={styles.text}>Eixo Z: {z.toFixed(2)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isPaused ? "▶️ Retomar" : "⏸️ Pausar"}
          onPress={toggleSubscription}
          color={isPaused ? "#00ff99" : "#ff6347"}
        />
      </View>

      <Text style={styles.subtitle}>Últimos 10 valores:</Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Text style={styles.historyItem}>
            {index + 1}. X:{item.x} | Y:{item.y} | Z:{item.z}
          </Text>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum dado ainda...</Text>
        }
      />

      <Text style={styles.info}>
        Mova o celular para ver as leituras mudarem!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  dataBox: {
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "80%",
    marginBottom: 15,
  },
  text: {
    color: "#00ff99",
    fontSize: 18,
    marginVertical: 5,
  },
  buttonContainer: {
    marginVertical: 15,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
    marginBottom: 5,
  },
  historyItem: {
    color: "#ccc",
    fontSize: 14,
  },
  emptyText: {
    color: "#777",
    marginTop: 10,
  },
  info: {
    marginTop: 20,
    color: "#888",
    fontSize: 14,
    textAlign: "center",
  },
});
