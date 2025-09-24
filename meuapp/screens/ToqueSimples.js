import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";

const colors = ["#2196F3", "#4CAF50", "#F44336"]; // azul, verde, vermelho

export default function App() {
  const [count, setCount] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const onSingleTap = () => {
    setCount(count + 1);
    setColorIndex((colorIndex + 1) % colors.length);
  };

  const reset = () => {
    setCount(0);
    setColorIndex(0);
  };

  return (
    <TapGestureHandler onActivated={onSingleTap}>
      <View style={[styles.container, { backgroundColor: colors[colorIndex] }]}>
        <Text style={styles.text}>Toque na tela</Text>
        <Text style={styles.text}>Contagem de toques: {count}</Text>
        <Text style={styles.reset} onPress={reset}>Resetar</Text>
      </View>
    </TapGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    margin: 10,
    color: "#fff",
  },
  reset: {
    marginTop: 20,
    fontSize: 18,
    color: "#fff",
    textDecorationLine: "underline",
  },
});