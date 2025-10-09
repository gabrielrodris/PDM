import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";
import * as FileSystem from "expo-file-system/legacy";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [savedText, setSavedText] = useState("");

  // Caminho do arquivo dentro do armazenamento do app
  const fileUri = FileSystem.documentDirectory + "meuArquivo.txt";

  // Função para salvar o texto no arquivo
  const saveToFile = async () => {
    try {
      await FileSystem.writeAsStringAsync(fileUri, inputText);
      Alert.alert("Sucesso", "Arquivo salvo com sucesso!");
      setInputText(""); // limpa o campo após salvar
    } catch (e) {
      Alert.alert("Erro", "Erro ao salvar arquivo: " + e.message);
    }
  };

  // Função para ler o texto do arquivo
  const readFromFile = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        Alert.alert("Aviso", "Nenhum arquivo encontrado ainda!");
        return;
      }

      const content = await FileSystem.readAsStringAsync(fileUri);
      setSavedText(content);
    } catch (e) {
      Alert.alert("Erro", "Erro ao ler arquivo: " + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Armazenamento Externo com Expo FileSystem
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite algo para salvar"
        value={inputText}
        onChangeText={setInputText}
      />

      <Button title="💾 Salvar no Arquivo" onPress={saveToFile} />

      <View style={{ height: 20 }} />

      <Button title="📖 Ler do Arquivo" onPress={readFromFile} />

      <Text style={styles.savedText}>
        <Text style={{ fontWeight: "bold" }}>Conteúdo salvo:</Text>{" "}
        {savedText || "(vazio)"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  savedText: {
    marginTop: 20,
    fontSize: 16,
  },
});
