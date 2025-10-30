import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");

export default function App() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState("parado");
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [pulseAnim] = useState(new Animated.Value(1));

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

  async function playSound() {
    try {
      if (!sound) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require("../assets/audio.mp3"),
          { shouldPlay: true, volume }
        );
        setSound(newSound);

        // Configurar listeners para posição e duração
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            if (status.isPlaying && isPlaying !== "tocando") {
              setIsPlaying("tocando");
              startPulse();
            }
          }
        });

        setIsPlaying("tocando");
        startPulse();
      } else {
        await sound.playAsync();
        setIsPlaying("tocando");
        startPulse();
      }
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
    }
  }

  async function pauseSound() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying("pausado");
      stopPulse();
    }
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      setIsPlaying("parado");
      setPosition(0);
      stopPulse();
    }
  }

  async function seekAudio(value) {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  }

  async function setAudioVolume(value) {
    setVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  }

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getStatusIcon = () => {
    switch (isPlaying) {
      case "tocando":
        return "pause-circle";
      case "pausado":
        return "play-circle";
      case "parado":
        return "play-circle";
      default:
        return "musical-notes";
    }
  };

  const getStatusColor = () => {
    switch (isPlaying) {
      case "tocando":
        return "#4ecdc4";
      case "pausado":
        return "#ffd93d";
      case "parado":
        return "#ff6b6b";
      default:
        return "#888";
    }
  };

  const getStatusText = () => {
    switch (isPlaying) {
      case "tocando":
        return "Reproduzindo";
      case "pausado":
        return "Pausado";
      case "parado":
        return "Parado";
      default:
        return "Pronto";
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="musical-notes" size={32} color="#4ecdc4" />
        <Text style={styles.title}>Reprodutor de Áudio</Text>
        <Text style={styles.subtitle}>Controle total da sua música</Text>
      </View>

      {/* Visualizador de Áudio */}
      <Animated.View
        style={[
          styles.visualizer,
          {
            transform: [{ scale: pulseAnim }],
            backgroundColor: getStatusColor() + "20",
            borderColor: getStatusColor(),
          },
        ]}
      >
        <Ionicons name={getStatusIcon()} size={80} color={getStatusColor()} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </Animated.View>

      {/* Informações da Música */}
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>Música de Exemplo</Text>
        <Text style={styles.trackArtist}>Artista Desconhecido</Text>
      </View>

      {/* Controle de Progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={duration || 1}
          value={position}
          onSlidingComplete={seekAudio}
          minimumTrackTintColor="#4ecdc4"
          maximumTrackTintColor="#2d2d44"
          thumbTintColor="#4ecdc4"
        />
      </View>

      {/* Controles Principais */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={stopSound}>
          <Ionicons name="stop-circle" size={28} color="#ff6b6b" />
          <Text style={styles.controlText}>Parar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.mainControl]}
          onPress={isPlaying === "tocando" ? pauseSound : playSound}
        >
          <Ionicons
            name={isPlaying === "tocando" ? "pause-circle" : "play-circle"}
            size={50}
            color="#4ecdc4"
          />
          <Text style={styles.controlText}>
            {isPlaying === "tocando" ? "Pausar" : "Reproduzir"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={pauseSound}
          disabled={isPlaying !== "tocando"}
        >
          <Ionicons
            name="pause-circle"
            size={28}
            color={isPlaying === "tocando" ? "#ffd93d" : "#888"}
          />
          <Text
            style={[
              styles.controlText,
              isPlaying !== "tocando" && { color: "#888" },
            ]}
          >
            Pausar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Controle de Volume */}
      <View style={styles.volumeContainer}>
        <Ionicons name="volume-low" size={20} color="#888" />
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setAudioVolume}
          minimumTrackTintColor="#4ecdc4"
          maximumTrackTintColor="#2d2d44"
          thumbTintColor="#4ecdc4"
        />
        <Ionicons name="volume-high" size={20} color="#888" />
      </View>

      {/* Informações Adicionais */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🔊 Use os controles para gerenciar a reprodução
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
  visualizer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 30,
    borderWidth: 3,
    borderStyle: "dashed",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  trackInfo: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  trackArtist: {
    fontSize: 14,
    color: "#888",
  },
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeText: {
    color: "#888",
    fontSize: 12,
  },
  progressBar: {
    width: "100%",
    height: 40,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  controlButton: {
    alignItems: "center",
    padding: 15,
    flex: 1,
  },
  mainControl: {
    flex: 1.5,
  },
  controlText: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 5,
    fontWeight: "500",
  },
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 15,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
});
