import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Preencha email e senha.");
      return;
    }
    if (password.length < 6) {
      alert("Senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // cria documento na coleção "usuarios" usando uid como id
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        email: email.trim(),
        criadoEm: serverTimestamp(),
      });

      alert("Usuário cadastrado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar: " + (error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  // Recria documento específico (executa uma vez ao montar) — evita top-level await
  useEffect(() => {
    const ensureDoc = async () => {
      try {
        const docId = "vMVIbH7f8YCDcazMQirQ";
        const docRef = doc(db, "usuarios", docId);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          await setDoc(docRef, {
            uid: docId,
            email: "user@example.com", // ajuste conforme necessário
            criadoEm: serverTimestamp(),
          });
          console.log("Documento recriado:", docId);
        } else {
          console.log("Documento já existe:", snap.data());
        }
      } catch (e) {
        console.error("Erro ao verificar/recriar documento:", e);
      }
    };
    ensureDoc();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
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
        placeholder="Senha (min 6 chars)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={loading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleRegister}
        disabled={loading}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
});
