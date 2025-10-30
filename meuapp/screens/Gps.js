import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));

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

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização negada ❌");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      setErrorMsg("Erro ao buscar localização: " + error.message);
    }
  };

  const startTracking = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização negada ❌");
        return;
      }

      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc);
        }
      );

      setSubscription(sub);
      setIsTracking(true);
      startPulse();
    } catch (error) {
      setErrorMsg("Erro ao iniciar rastreamento: " + error.message);
    }
  };

  const stopTracking = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
      setIsTracking(false);
      stopPulse();
    }
  };

  useEffect(() => {
    getLocation();
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const getAccuracyColor = (accuracy) => {
    if (accuracy < 10) return "#4ecdc4";
    if (accuracy < 25) return "#ffd93d";
    return "#ff6b6b";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="location" size={32} color="#4ecdc4" />
        <Text style={styles.title}>📍 Rastreador GPS</Text>
        <Text style={styles.subtitle}>Monitoramento em Tempo Real</Text>
      </View>

      {/* Status Indicator */}
      <Animated.View
        style={[
          styles.statusContainer,
          { transform: [{ scale: isTracking ? pulseAnim : 1 }] },
        ]}
      >
        <View style={styles.statusIndicator}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isTracking ? "#4ecdc4" : "#ff6b6b" },
            ]}
          />
          <Text style={styles.statusText}>
            {isTracking ? "🟢 Rastreamento Ativo" : "🔴 Rastreamento Parado"}
          </Text>
        </View>
      </Animated.View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={getLocation}>
          <Ionicons name="navigate" size={24} color="white" />
          <Text style={styles.controlButtonText}>Localização Atual</Text>
        </TouchableOpacity>

        <View style={styles.trackingControls}>
          <TouchableOpacity
            style={[
              styles.trackingButton,
              styles.startButton,
              { opacity: isTracking ? 0.6 : 1 },
            ]}
            onPress={startTracking}
            disabled={isTracking}
          >
            <Ionicons name="play" size={20} color="white" />
            <Text style={styles.trackingButtonText}>Iniciar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.trackingButton,
              styles.stopButton,
              { opacity: !isTracking ? 0.6 : 1 },
            ]}
            onPress={stopTracking}
            disabled={!isTracking}
          >
            <Ionicons name="stop" size={20} color="white" />
            <Text style={styles.trackingButtonText}>Parar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Data */}
      <Animated.View style={[styles.locationContainer, { opacity: fadeAnim }]}>
        {errorMsg ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={40} color="#ff6b6b" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : location ? (
          <View style={styles.locationCard}>
            <Text style={styles.locationTitle}>📊 Dados de Localização</Text>

            <View style={styles.coordinates}>
              <View style={styles.coordinateItem}>
                <Text style={styles.coordinateLabel}>Latitude</Text>
                <Text style={styles.coordinateValue}>
                  {location.coords.latitude.toFixed(6)}
                </Text>
              </View>

              <View style={styles.coordinateItem}>
                <Text style={styles.coordinateLabel}>Longitude</Text>
                <Text style={styles.coordinateValue}>
                  {location.coords.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Precisão</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: getAccuracyColor(location.coords.accuracy) },
                  ]}
                >
                  ±{location.coords.accuracy.toFixed(1)}m
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Velocidade</Text>
                <Text style={styles.detailValue}>
                  {location.coords.speed
                    ? `${location.coords.speed.toFixed(1)} m/s`
                    : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Ionicons name="location" size={50} color="#888" />
            <Text style={styles.loadingText}>Buscando localização...</Text>
          </View>
        )}
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡{" "}
          {isTracking
            ? "Rastreamento ativo - GPS monitorando..."
            : "Toque em Iniciar para rastreamento contínuo"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
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
  statusContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  controls: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4ecdc4",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  controlButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  trackingControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  trackingButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButton: {
    backgroundColor: "#4ecdc4",
    shadowColor: "#4ecdc4",
  },
  stopButton: {
    backgroundColor: "#ff6b6b",
    shadowColor: "#ff6b6b",
  },
  trackingButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  locationContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a2e",
    padding: 30,
    borderRadius: 15,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  locationCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  coordinates: {
    marginBottom: 20,
  },
  coordinateItem: {
    marginBottom: 15,
  },
  coordinateLabel: {
    color: "#888",
    fontSize: 14,
    marginBottom: 5,
  },
  coordinateValue: {
    color: "#4ecdc4",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 5,
  },
  detailValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    color: "#888",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#2d2d44",
  },
  footerText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
});
