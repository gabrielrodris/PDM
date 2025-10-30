import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const colors = [
  { bg: "#2196F3", name: "Azul", icon: "water" },
  { bg: "#4CAF50", name: "Verde", icon: "leaf" },
  { bg: "#F44336", name: "Vermelho", icon: "flame" },
  { bg: "#FF9800", name: "Laranja", icon: "sunny" },
  { bg: "#9C27B0", name: "Roxo", icon: "flower" },
  { bg: "#607D8B", name: "Cinza", name: "options" },
];

export default function App() {
  const [count, setCount] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [combo, setCombo] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const startPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startScale = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTapTime;

      // Combo system - taps within 500ms
      if (timeDiff < 500) {
        setCombo((prev) => prev + 1);
      } else {
        setCombo(1);
      }
      setLastTapTime(currentTime);

      const newCount = count + 1;
      setCount(newCount);
      setColorIndex(newCount % colors.length);

      startPulse();
      startScale();
    }
  };

  const reset = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setCount(0);
    setColorIndex(0);
    setCombo(0);
  };

  const getAchievement = () => {
    if (count >= 100) return "🎯 Mestre dos Toques!";
    if (count >= 50) return "🔥 Incrível!";
    if (count >= 25) return "⭐ Bom trabalho!";
    if (count >= 10) return "👏 Continue assim!";
    return "💡 Toque na tela para começar";
  };

  const getComboMessage = () => {
    if (combo >= 10) return `🔥 COMBO ${combo}x! INSANO!`;
    if (combo >= 5) return `⚡ COMBO ${combo}x! Incrível!`;
    if (combo >= 3) return `🎯 COMBO ${combo}x!`;
    return "";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TapGestureHandler onHandlerStateChange={onSingleTap}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors[colorIndex].bg,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header Info */}
          <View style={styles.header}>
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Ionicons name="color-palette" size={16} color="white" />
                <Text style={styles.statText}>{colors[colorIndex].name}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="pulse" size={16} color="white" />
                <Text style={styles.statText}>Combo: {combo}x</Text>
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Animated.View
              style={[
                styles.iconContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Ionicons
                name={colors[colorIndex].icon}
                size={80}
                color="white"
              />
            </Animated.View>

            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.countLabel}>Toques</Text>

            <Animated.Text
              style={[
                styles.achievement,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              {getAchievement()}
            </Animated.Text>

            {combo >= 3 && (
              <Animated.Text
                style={[
                  styles.comboText,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                {getComboMessage()}
              </Animated.Text>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.instruction}>
              👆 Toque em qualquer lugar para contar
            </Text>

            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.resetText}>Reiniciar</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            {colors.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor:
                      index === colorIndex ? "white" : "rgba(255,255,255,0.3)",
                    transform: [{ scale: index === colorIndex ? 1.2 : 1 }],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </TapGestureHandler>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  header: {
    width: "100%",
    paddingHorizontal: 25,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  mainContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 20,
  },
  countText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  countLabel: {
    fontSize: 18,
    color: "white",
    opacity: 0.9,
    marginBottom: 20,
  },
  achievement: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  comboText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  instruction: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 15,
    textAlign: "center",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  resetText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    transition: "all 0.3s ease",
  },
});
