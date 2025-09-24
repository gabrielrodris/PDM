import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
export default function CustomButton({ text, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6200ee",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
