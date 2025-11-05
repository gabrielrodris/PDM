import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  Dimensions,
  SafeAreaView,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function App() {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  // Atualiza as coordenadas em tempo real
  useEffect(() => {
    const updateCoordinates = () => {
      setCoordinates({
        x: Math.round(pan.x._value),
        y: Math.round(pan.y._value),
      });
    };

    // Listener para atualizar sempre que os valores mudarem
    const xId = pan.x.addListener(updateCoordinates);
    const yId = pan.y.addListener(updateCoordinates);

    return () => {
      pan.x.removeListener(xId);
      pan.y.removeListener(yId);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        // Atualiza imediatamente no grant
        setCoordinates({
          x: Math.round(pan.x._value),
          y: Math.round(pan.y._value),
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pan.x,
            dy: pan.y,
          },
        ],
        {
          useNativeDriver: false,
          listener: () => {
            // Atualiza durante o movimento
            setCoordinates({
              x: Math.round(pan.x._value),
              y: Math.round(pan.y._value),
            });
          },
        }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          tension: 40,
          useNativeDriver: false,
        }).start();
        // Atualiza após o release
        setTimeout(() => {
          setCoordinates({
            x: Math.round(pan.x._value),
            y: Math.round(pan.y._value),
          });
        }, 100);
      },
    })
  ).current;

  const rotateX = pan.x.interpolate({
    inputRange: [-width / 3, 0, width / 3],
    outputRange: ["-30deg", "0deg", "30deg"],
    extrapolate: "clamp",
  });

  const rotateY = pan.y.interpolate({
    inputRange: [-height / 4, 0, height / 4],
    outputRange: ["30deg", "0deg", "-30deg"],
    extrapolate: "clamp",
  });

  const backgroundColor = pan.x.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: ["#ff6b6b", "#4ecdc4", "#45b7d1"],
    extrapolate: "clamp",
  });

  const getProgressPosition = (value, max) => {
    const progress = (value / max) * 100;
    return Math.max(-100, Math.min(100, progress));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎮 Arraste o Cubo</Text>
      <Text style={styles.subtitle}>Toque e arraste o cubo para movê-lo</Text>

      {/* Área de jogo */}
      <View style={styles.gameArea}>
        <Animated.View
          style={[
            styles.box,
            {
              backgroundColor,
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotateX },
                { rotateY },
                { perspective: 1000 },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.boxText}>Drag Me</Text>
          <View style={styles.coordinatesOverlay}>
            <Text style={styles.coordinatesOverlayText}>
              {coordinates.x}, {coordinates.y}
            </Text>
          </View>
        </Animated.View>

        {/* Grade de referência */}
        <View style={styles.centerX} />
        <View style={styles.centerY} />
        <View style={styles.centerDot} />

        {/* Marcadores de coordenadas */}
        <View style={styles.coordinateMarkerX} pointerEvents="none">
          <Text style={styles.coordinateMarkerText}>X: {coordinates.x}</Text>
        </View>
        <View style={styles.coordinateMarkerY} pointerEvents="none">
          <Text style={styles.coordinateMarkerText}>Y: {coordinates.y}</Text>
        </View>
      </View>

      {/* Painel de coordenadas */}
      <View style={styles.coordinatesPanel}>
        <Text style={styles.coordinatesTitle}>
          📊 Coordenadas em Tempo Real
        </Text>

        <View style={styles.coordinatesDisplay}>
          <View style={styles.coordinateItem}>
            <Text style={styles.coordinateLabel}>Eixo X:</Text>
            <Text style={styles.coordinateValue}>{coordinates.x}px</Text>
          </View>
          <View style={styles.coordinateItem}>
            <Text style={styles.coordinateLabel}>Eixo Y:</Text>
            <Text style={styles.coordinateValue}>{coordinates.y}px</Text>
          </View>
        </View>

        {/* Visualização gráfica */}
        <View style={styles.visualization}>
          <View style={styles.axis}>
            <Text style={styles.axisLabel}>X: {coordinates.x}</Text>
            <View style={styles.axisTrack}>
              <View
                style={[
                  styles.axisIndicator,
                  {
                    left: `${50 + getProgressPosition(coordinates.x, 150)}%`,
                    backgroundColor: coordinates.x > 0 ? "#45b7d1" : "#ff6b6b",
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.axis}>
            <Text style={styles.axisLabel}>Y: {coordinates.y}</Text>
            <View style={styles.axisTrack}>
              <View
                style={[
                  styles.axisIndicator,
                  {
                    left: `${50 + getProgressPosition(coordinates.y, 150)}%`,
                    backgroundColor: coordinates.y > 0 ? "#45b7d1" : "#ff6b6b",
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        <Text style={styles.instruction}>
          💡 As coordenadas atualizam instantaneamente enquanto você arrasta
        </Text>

        <View style={styles.controlButtons}>
          <Text
            style={styles.resetButton}
            onPress={() => {
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                friction: 5,
                tension: 40,
                useNativeDriver: false,
              }).start();
              // Atualiza coordenadas imediatamente
              setCoordinates({ x: 0, y: 0 });
            }}
          >
            🔄 Centralizar (0, 0)
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
  },
  gameArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#1a1a2e",
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#2d2d44",
    borderStyle: "dashed",
    overflow: "hidden",
    position: "relative",
  },
  box: {
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 3,
    borderColor: "#ffffff",
    position: "absolute",
  },
  boxText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  coordinatesOverlay: {
    position: "absolute",
    bottom: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  coordinatesOverlayText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  // Grade de referência
  centerX: {
    position: "absolute",
    height: 1,
    width: "100%",
    backgroundColor: "rgba(78, 205, 196, 0.3)",
    top: "50%",
  },
  centerY: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(78, 205, 196, 0.3)",
    left: "50%",
  },
  centerDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ecdc4",
    top: "50%",
    left: "50%",
    marginLeft: -4,
    marginTop: -4,
  },
  // Marcadores de coordenadas
  coordinateMarkerX: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 107, 107, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  coordinateMarkerY: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(69, 183, 209, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  coordinateMarkerText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Painel de coordenadas
  coordinatesPanel: {
    backgroundColor: "#1a1a2e",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  coordinatesTitle: {
    color: "#4ecdc4",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  coordinatesDisplay: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  coordinateItem: {
    alignItems: "center",
  },
  coordinateLabel: {
    color: "#888",
    fontSize: 14,
    marginBottom: 5,
  },
  coordinateValue: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  // Visualização gráfica
  visualization: {
    gap: 15,
  },
  axis: {
    gap: 8,
  },
  axisLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
  axisTrack: {
    height: 6,
    backgroundColor: "#2d2d44",
    borderRadius: 3,
    position: "relative",
  },
  axisIndicator: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    top: -3,
    marginLeft: -6,
  },
  // Controles
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  instruction: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  controlButtons: {
    alignItems: "center",
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
    textAlign: "center",
  },
});
