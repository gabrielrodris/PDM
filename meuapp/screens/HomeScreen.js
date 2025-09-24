import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Bem-vindo à tela inicial</Text>
      <CustomButton
        text="Clique aqui"
        onPress={() => alert("Botão clicado!")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
