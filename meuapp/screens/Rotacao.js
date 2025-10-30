import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { RotationGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function App() {
  const [rotate] = useState(new Animated.Value(0));
  const [angle, setAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationCount, setRotationCount] = useState(0);

  const onRotateEvent = Animated.event(
    [{ nativeEvent: { rotation: rotate } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        let raw = event.nativeEvent.rotation;
        // Limita entre -π e π
        if (raw > Math.PI) raw = Math.PI;
        if (raw < -Math.PI) raw = -Math.PI;
        const degrees = raw * (180 / Math.PI);
        setAngle(degrees);
        rotate.setValue(raw);
      },
    }
  );

  const onRotateStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setIsRotating(false);
      // Contar rotações completas
      if (Math.abs(angle) >= 180) {
        setRotationCount((prev) => prev + (angle > 0 ? 1 : -1));
      }
    } else if (event.nativeEvent.state === State.ACTIVE) {
      setIsRotating(true);
    }
  };

  const resetRotation = () => {
    Animated.spring(rotate, {
      toValue: 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    setAngle(0);
    setRotationCount(0);
  };

  // Cores dinâmicas baseadas no ângulo
  const getBoxColor = () => {
    const absAngle = Math.abs(angle);
    if (absAngle < 45) return "#4ecdc4";
    if (absAngle < 90) return "#45b7d1";
    if (absAngle < 135) return "#96ceb4";
    if (absAngle < 180) return "#ffd93d";
    return "#ff6b6b";
  };

  const getRotationDirection = () => {
    if (angle === 0) return "⚪ Centro";
    return angle > 0 ? "🟢 Horário" : "🔴 Anti-horário";
  };

  const boxColor = getBoxColor();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="sync" size={32} color="#4ecdc4" />
        <Text style={styles.title}>Giro Interativo</Text>
        <Text style={styles.subtitle}>Use dois dedos para rotacionar</Text>
      </View>

      {/* Rotation Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ângulo</Text>
              <Text style={styles.infoValue}>
                {Math.abs(angle).toFixed(1)}°
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Direção</Text>
              <Text style={styles.infoValue}>{getRotationDirection()}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Rotações</Text>
              <Text style={styles.infoValue}>{rotationCount}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isRotating ? "#4ecdc4" : "#888" },
                ]}
              >
                {isRotating ? "🔄 Girando..." : "⏸️ Parado"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Rotation Visualizer */}
      <View style={styles.rotationContainer}>
        <RotationGestureHandler
          onGestureEvent={onRotateEvent}
          onHandlerStateChange={onRotateStateChange}
        >
          <Animated.View
            style={[
              styles.box,
              {
                backgroundColor: boxColor,
                transform: [
                  {
                    rotate: rotate.interpolate({
                      inputRange: [-Math.PI, Math.PI],
                      outputRange: ["-180deg", "180deg"],
                    }),
                  },
                  {
                    scale: isRotating
                      ? rotate.interpolate({
                          inputRange: [-Math.PI, 0, Math.PI],
                          outputRange: [1.1, 1, 1.1],
                        })
                      : 1,
                  },
                ],
                shadowColor: boxColor,
                shadowOpacity: isRotating ? 0.6 : 0.3,
              },
            ]}
          >
            <View style={styles.boxContent}>
              <Ionicons
                name="sync"
                size={40}
                color="#ffffff"
                style={{ transform: [{ rotate: `${-angle}deg` }] }}
              />
              <Text style={styles.boxText}>{Math.abs(angle).toFixed(0)}°</Text>
            </View>

            {/* Indicadores de direção */}
            <View style={styles.directionIndicators}>
              <View style={[styles.indicator, styles.clockwise]}>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </View>
              <View style={[styles.indicator, styles.counterClockwise]}>
                <Ionicons name="arrow-back" size={16} color="#ffffff" />
              </View>
            </View>
          </Animated.View>
        </RotationGestureHandler>

        {/* Marcadores de ângulo */}
        <View style={styles.angleMarkers}>
          {[0, 45, 90, 135, 180].map((mark) => (
            <View key={mark} style={styles.marker}>
              <Text style={styles.markerText}>{mark}°</Text>
              <View style={styles.markerLine} />
            </View>
          ))}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Text style={styles.hint}>
          💡 Use dois dedos e faça um movimento circular para rotacionar
        </Text>

        <View style={styles.controlButtons}>
          <Text style={styles.resetButton} onPress={resetRotation}>
            🔄 Centralizar
          </Text>
        </View>
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
    paddingHorizontal: 30,
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
  infoContainer: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 5,
  },
  infoValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rotationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  box: {
    width: 200,
    height: 200,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 4,
    borderColor: "#ffffff",
  },
  boxContent: {
    alignItems: "center",
  },
  boxText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  directionIndicators: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  indicator: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 5,
  },
  clockwise: {
    top: 10,
    right: 10,
  },
  counterClockwise: {
    top: 10,
    left: 10,
  },
  angleMarkers: {
    position: "absolute",
    width: 280,
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  marker: {
    position: "absolute",
    alignItems: "center",
  },
  markerText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 5,
  },
  markerLine: {
    width: 2,
    height: 10,
    backgroundColor: "#888",
  },
  controls: {
    paddingHorizontal: 30,
    alignItems: "center",
  },
  hint: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  resetButton: {
    backgroundColor: "#1a1a2e",
    color: "#4ecdc4",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#4ecdc4",
  },
});
