import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { LongPressGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function App() {
  const [message, setMessage] = useState("Pressione e segure o quadrado 👇");
  const [isPressed, setIsPressed] = useState(false);
  const [pressCount, setPressCount] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const startProgress = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const resetProgress = () => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onLongPress = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setIsPressed(true);
      startPulse();
      startProgress();
    } else if (
      event.nativeEvent.state === State.END ||
      event.nativeEvent.state === State.CANCELLED
    ) {
      setIsPressed(false);
      stopPulse();
      resetProgress();

      if (event.nativeEvent.state === State.END) {
        setPressCount((prev) => prev + 1);
        setMessage("🎉 Você fez um toque longo!");

        // Animação de confirmação
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        setMessage("❌ Toque cancelado... Tente novamente!");
      }
    } else if (event.nativeEvent.state === State.BEGAN) {
      setMessage("⏳ Continue segurando...");
    }
  };

  const getMessageColor = () => {
    if (message.includes("🎉")) return "#4ecdc4";
    if (message.includes("❌")) return "#ff6b6b";
    if (message.includes("⏳")) return "#ffd93d";
    return "#ffffff";
  };

  const getBoxColor = () => {
    return isPressed ? "#4ecdc4" : "#ff6b6b";
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="timer" size={32} color="#4ecdc4" />
        <Text style={styles.title}>Toque Longo</Text>
        <Text style={styles.subtitle}>Segure por 1 segundo para ativar</Text>
      </View>

      {/* Message Display */}
      <Animated.View style={styles.messageContainer}>
        <Text style={[styles.message, { color: getMessageColor() }]}>
          {message}
        </Text>
        <Text style={styles.counter}>Toques longos: {pressCount}</Text>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
                backgroundColor: getBoxColor(),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {isPressed ? "Segurando..." : "Pressione e segure"}
        </Text>
      </View>

      {/* Interactive Box */}
      <LongPressGestureHandler
        onHandlerStateChange={onLongPress}
        minDurationMs={1000}
      >
        <Animated.View
          style={[
            styles.box,
            {
              backgroundColor: getBoxColor(),
              transform: [{ scale: isPressed ? pulseAnim : scaleAnim }],
              shadowColor: getBoxColor(),
              shadowOpacity: isPressed ? 0.6 : 0.3,
            },
          ]}
        >
          <View style={styles.boxContent}>
            <Ionicons
              name={isPressed ? "checkmark-circle" : "hand-left"}
              size={40}
              color="#ffffff"
            />
            <Text style={styles.boxText}>
              {isPressed ? "Solte agora!" : "Segure-me"}
            </Text>
            <Text style={styles.boxSubtext}>
              {isPressed ? "🎉 Quase lá!" : "👇 1 segundo"}
            </Text>
          </View>

          {/* Timer indicator */}
          {isPressed && (
            <View style={styles.timerIndicator}>
              <Ionicons name="time" size={16} color="#ffffff" />
              <Text style={styles.timerText}>Segurando...</Text>
            </View>
          )}
        </Animated.View>
      </LongPressGestureHandler>

      {/* Instructions */}
      <View style={styles.instructions}>
        <View style={styles.instructionItem}>
          <Ionicons name="information-circle" size={16} color="#4ecdc4" />
          <Text style={styles.instructionText}>
            Pressione e mantenha por 1 segundo
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="color-wand" size={16} color="#4ecdc4" />
          <Text style={styles.instructionText}>
            A barra de progresso mostra o tempo
          </Text>
        </View>
      </View>

      {/* Achievement Badge */}
      {pressCount >= 5 && (
        <View style={styles.achievement}>
          <Ionicons name="trophy" size={24} color="#ffd93d" />
          <Text style={styles.achievementText}>🏆 Mestre do Toque Longo!</Text>
        </View>
      )}
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
  messageContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  counter: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "#2d2d44",
    borderRadius: 3,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
  box: {
    width: 200,
    height: 200,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 40,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 16,
  },
  boxContent: {
    alignItems: "center",
  },
  boxText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  boxSubtext: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  timerIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  timerText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  instructions: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  instructionText: {
    color: "#888",
    fontSize: 14,
    marginLeft: 8,
  },
  achievement: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 217, 61, 0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffd93d",
    alignSelf: "center",
  },
  achievementText: {
    color: "#ffd93d",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});
