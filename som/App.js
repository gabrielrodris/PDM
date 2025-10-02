import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export default function App() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState("parado");

  async function playSound() {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("./assets/audio.mp3")
      );
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    } else {
      await sound.playAsync();
      setIsPlaying("tocando");
    }
  }

  async function pauseSound() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying("pausado");
    }
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      setIsPlaying("parado");
    }
  }

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Reprodutor de Audio</Text>
        <Button title="Play" onPress={playSound}></Button>
        <Button title="Pause" onPress={pauseSound}></Button>
        <Button title="Stop" onPress={stopSound}></Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});
