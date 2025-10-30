import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapType, setMapType] = useState("standard");
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de localização negada");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc.coords);

      // Animações após carregar a localização
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    })();
  }, []);

  const centerMap = async () => {
    try {
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc.coords);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a localização");
    }
  };

  const toggleMapType = () => {
    setMapType(mapType === "standard" ? "satellite" : "standard");
  };

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="location-off" size={80} color="#ff6b6b" />
        <Text style={styles.errorTitle}>Localização Desativada</Text>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!location) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Ionicons name="navigate" size={80} color="#4ecdc4" />
        </Animated.View>
        <Text style={styles.loadingTitle}>Buscando Localização</Text>
        <Text style={styles.loadingText}>Ativando o GPS...</Text>
        <ActivityIndicator
          size="large"
          color="#4ecdc4"
          style={styles.spinner}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

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
        <View style={styles.headerContent}>
          <Ionicons name="map" size={24} color="#0f0f23" />
          <Text style={styles.headerTitle}>Mapa ao Vivo</Text>
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.coordinates}>
            📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        </View>
      </Animated.View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType={mapType}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Sua Localização"
          description="Você está aqui!"
        >
          <View style={styles.customMarker}>
            <View style={styles.markerPulse} />
            <Ionicons name="location" size={20} color="#ffffff" />
          </View>
        </Marker>
      </MapView>

      {/* Map Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={centerMap}>
          <Ionicons name="navigate" size={24} color="#0f0f23" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={toggleMapType}>
          <Ionicons
            name={mapType === "standard" ? "earth" : "map"}
            size={24}
            color="#0f0f23"
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Info */}
      <Animated.View
        style={[
          styles.bottomInfo,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="speedometer" size={16} color="#4ecdc4" />
            <Text style={styles.infoText}>
              Velocidade:{" "}
              {location.speed
                ? `${(location.speed * 3.6).toFixed(1)} km/h`
                : "0 km/h"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="accuracy" size={16} color="#4ecdc4" />
            <Text style={styles.infoText}>
              Precisão: ±{location.accuracy?.toFixed(1) || "0"}m
            </Text>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f23",
    padding: 30,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },
  spinner: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f23",
    padding: 30,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#4ecdc4",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f0f23",
    marginLeft: 8,
  },
  locationInfo: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  coordinates: {
    fontSize: 12,
    color: "#0f0f23",
    fontWeight: "500",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  controls: {
    position: "absolute",
    right: 20,
    bottom: 120,
    gap: 10,
  },
  controlButton: {
    backgroundColor: "#ffffff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4ecdc4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerPulse: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(78, 205, 196, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(78, 205, 196, 0.5)",
  },
  bottomInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#0f0f23",
    fontWeight: "500",
    marginLeft: 8,
  },
});
