import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import { Accelerometer } from "expo-sensors";

const { width } = Dimensions.get("window");

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState([]);
  const [pulseAnim] = useState(new Animated.Value(1));

  const LIMIT = 2.5;

  // Animação de pulso para dados ativos
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.setValue(1);
    pulseAnim.stopAnimation();
  };

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

        if (total > LIMIT) {
          Alert.alert(
            "🚨 Movimento Brusco Detectado!",
            `Aceleração total: ${total.toFixed(2)} G`,
            [{ text: "OK", style: "default" }]
          );
        }

        setHistory((prev) => {
          const updated = [
            {
              id: Date.now().toString(),
              x: accelerometerData.x.toFixed(2),
              y: accelerometerData.y.toFixed(2),
              z: accelerometerData.z.toFixed(2),
              total: total.toFixed(2),
            },
            ...prev,
          ];
          return updated.slice(0, 10);
        });
      })
    );

    Accelerometer.setUpdateInterval(500);
    startPulse();
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
    stopPulse();
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
  const totalAcceleration = Math.sqrt(x ** 2 + y ** 2 + z ** 2).toFixed(2);

  // Cor baseada na intensidade do movimento
  const getIntensityColor = (value) => {
    const intensity = Math.min(Math.abs(value) * 2, 1);
    const r = Math.floor(255 * intensity);
    const g = Math.floor(255 * (1 - intensity));
    const b = 100;
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Acelerômetro Pro</Text>
        <Text style={styles.subtitle}>Monitor de Movimento em Tempo Real</Text>
      </View>

      {/* Indicador de Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusIndicator}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isPaused ? "#ff6b6b" : "#4ecdc4" },
            ]}
          />
          <Text style={styles.statusText}>
            {isPaused ? "⏸️ Pausado" : "📊 Monitorando..."}
          </Text>
        </View>
      </View>

      {/* Cards de Dados */}
      <Animated.View
        style={[
          styles.dataContainer,
          { transform: [{ scale: isPaused ? 1 : pulseAnim }] },
        ]}
      >
        <View style={styles.dataRow}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Eixo X</Text>
            <Text style={[styles.dataValue, { color: getIntensityColor(x) }]}>
              {x.toFixed(2)}
            </Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Eixo Y</Text>
            <Text style={[styles.dataValue, { color: getIntensityColor(y) }]}>
              {y.toFixed(2)}
            </Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>Eixo Z</Text>
            <Text style={[styles.dataValue, { color: getIntensityColor(z) }]}>
              {z.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Aceleração Total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Aceleração Total</Text>
          <Text
            style={[
              styles.totalValue,
              { color: totalAcceleration > LIMIT ? "#ff6b6b" : "#4ecdc4" },
            ]}
          >
            {totalAcceleration} G
          </Text>
          <View style={styles.limitBar}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${(totalAcceleration / LIMIT) * 100}%`,
                  backgroundColor:
                    totalAcceleration > LIMIT ? "#ff6b6b" : "#4ecdc4",
                },
              ]}
            />
          </View>
          <Text style={styles.limitText}>Limite: {LIMIT} G</Text>
        </View>
      </Animated.View>

      {/* Botão de Controle */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          { backgroundColor: isPaused ? "#4ecdc4" : "#ff6b6b" },
        ]}
        onPress={toggleSubscription}
      >
        <Text style={styles.controlButtonText}>
          {isPaused ? "▶️ Retomar Monitoramento" : "⏸️ Pausar Monitoramento"}
        </Text>
      </TouchableOpacity>

      {/* Histórico */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>
          📋 Histórico (Últimas 10 leituras)
        </Text>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          style={styles.historyList}
          renderItem={({ item, index }) => (
            <View
              style={[styles.historyItem, index === 0 && styles.latestItem]}
            >
              <Text style={styles.historyIndex}>#{index + 1}</Text>
              <View style={styles.historyData}>
                <Text style={styles.historyText}>X: {item.x}</Text>
                <Text style={styles.historyText}>Y: {item.y}</Text>
                <Text style={styles.historyText}>Z: {item.z}</Text>
              </View>
              <Text style={styles.historyTotal}>Total: {item.total}G</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>📊 Aguardando dados...</Text>
          }
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Mova o dispositivo para ver as mudanças em tempo real!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  dataContainer: {
    marginBottom: 25,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dataCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dataLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4ecdc4",
  },
  totalCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  totalLabel: {
    color: "#888",
    fontSize: 14,
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  limitBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#2d2d44",
    borderRadius: 3,
    marginBottom: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  limitText: {
    color: "#666",
    fontSize: 12,
  },
  controlButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  controlButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  historyContainer: {
    flex: 1,
    marginBottom: 20,
  },
  historyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  latestItem: {
    borderLeftWidth: 3,
    borderLeftColor: "#4ecdc4",
  },
  historyIndex: {
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    minWidth: 25,
  },
  historyData: {
    flex: 1,
    flexDirection: "row",
  },
  historyText: {
    color: "#ccc",
    fontSize: 12,
    marginRight: 10,
  },
  historyTotal: {
    color: "#4ecdc4",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
  },
  footer: {
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#2d2d44",
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
});
