import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [scale] = useState(new Animated.Value(1));
  const [zoomText, setZoomText] = useState("1.00");
  const [rotation] = useState(new Animated.Value(0));
  const [isZooming, setIsZooming] = useState(false);

  const onPinchEvent = Animated.event([{ nativeEvent: { scale: scale } }], {
    useNativeDriver: true,
  });

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      setIsZooming(false);
      Animated.spring(rotation, {
        toValue: 0,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else if (event.nativeEvent.state === State.ACTIVE) {
      setIsZooming(true);
    }
  };

  React.useEffect(() => {
    const id = scale.addListener(({ value }) => {
      setZoomText(value.toFixed(2));

      // Rotação sutil durante o zoom
      if (value > 1) {
        rotation.setValue((value - 1) * 10);
      }
    });
    return () => {
      scale.removeListener(id);
    };
  }, [scale, rotation]);

  const resetZoom = () => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start();
    Animated.spring(rotation, {
      toValue: 0,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const zoomLevel = parseFloat(zoomText);
  const backgroundColor =
    zoomLevel > 2 ? "#ff6b6b" : zoomLevel > 1.5 ? "#ffd93d" : "#4ecdc4";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Gestos de Pinch</Text>
        <Text style={styles.subtitle}>Use dois dedos para zoom in/out</Text>
      </View>

      <View style={styles.zoomIndicator}>
        <View style={styles.zoomLevel}>
          <Text style={styles.zoomText}>Zoom: {zoomText}x</Text>
        </View>
        <View style={styles.zoomBar}>
          <View
            style={[
              styles.zoomProgress,
              {
                width: `${Math.min(zoomLevel * 25, 100)}%`,
                backgroundColor,
              },
            ]}
          />
        </View>
      </View>

      <PinchGestureHandler
        onGestureEvent={onPinchEvent}
        onHandlerStateChange={onPinchStateChange}
      >
        <Animated.View
          style={[
            styles.box,
            {
              transform: [
                { scale },
                {
                  rotate: rotation.interpolate({
                    inputRange: [-360, 360],
                    outputRange: ["-360deg", "360deg"],
                  }),
                },
              ],
              backgroundColor,
              shadowColor: backgroundColor,
              shadowOpacity: isZooming ? 0.6 : 0.3,
            },
          ]}
        >
          <View style={styles.boxContent}>
            <Animated.Text
              style={[
                styles.boxTitle,
                {
                  transform: [
                    {
                      scale: scale.interpolate({
                        inputRange: [0.5, 2],
                        outputRange: [1.2, 0.8],
                      }),
                    },
                  ],
                },
              ]}
            >
              {zoomLevel > 2
                ? "🎉 Máximo!"
                : zoomLevel > 1.5
                ? "🔥 Ótimo!"
                : "👆 Pinch Me"}
            </Animated.Text>
            <Text style={styles.boxSubtitle}>
              {isZooming ? "Solte para confirmar" : "Use dois dedos"}
            </Text>
          </View>
        </Animated.View>
      </PinchGestureHandler>

      <View style={styles.controls}>
        <Text style={styles.hint}>
          💡 Dica: Afaste os dedos para aumentar, aproxime para diminuir
        </Text>

        <Animated.View
          style={[
            styles.resetButton,
            {
              opacity: zoomLevel > 1.1 ? 1 : 0.6,
              transform: [
                {
                  scale:
                    zoomLevel > 1.1
                      ? scale.interpolate({
                          inputRange: [1, 2],
                          outputRange: [1, 1.1],
                        })
                      : 1,
                },
              ],
            },
          ]}
        >
          <Text style={styles.resetButtonText} onPress={resetZoom}>
            🔄 Resetar Zoom
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
    paddingTop: 60,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  zoomIndicator: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  zoomLevel: {
    alignItems: "center",
    marginBottom: 10,
  },
  zoomText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  zoomBar: {
    height: 6,
    backgroundColor: "#2d2d44",
    borderRadius: 3,
    overflow: "hidden",
  },
  zoomProgress: {
    height: "100%",
    borderRadius: 3,
  },
  box: {
    width: 250,
    height: 250,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 16,
  },
  boxContent: {
    alignItems: "center",
  },
  boxTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  boxSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  hint: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#4ecdc4",
  },
  resetButtonText: {
    color: "#4ecdc4",
    fontSize: 16,
    fontWeight: "bold",
  },
});
