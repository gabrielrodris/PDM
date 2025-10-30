import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const e = (email || "").trim();
    if (!e || !password) {
      alert("Preencha email e senha.");
      return;
    }
    setLoading(true);
    try {
      console.log("Tentando login:", e);
      await signInWithEmailAndPassword(auth, e, password);
      // Navega para o Drawer principal e abre a tela "Início"
      navigation.navigate("Main", { screen: "Início" });
    } catch (error) {
      console.error("Erro ao logar:", error);
      alert("Erro ao fazer login: " + (error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
      />
      <Button
        title="Cadastrar"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});
