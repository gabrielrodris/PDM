import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TextInput, Alert } from "react-native";

import * as FileSystem from "expo-file-system/legacy";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [savedText, setSavedText] = useState("");

  
  const fileUri = FileSystem.documentDirectory + "meuArquivo.txt";

  useEffect(() => {
    
    readFromFile();
  }, []);

  // Função para salvar o texto no arquivo
  const saveToFile = async () => {
    try {
      await FileSystem.writeAsStringAsync(fileUri, inputText ?? "", {
        encoding: FileSystem.EncodingType.UTF8,
      });
      Alert.alert("Sucesso", "Arquivo salvo com sucesso!");
      setInputText(""); // limpa o campo após salvar
      setSavedText(inputText ?? "");
    } catch (e) {
      Alert.alert("Erro", "Erro ao salvar arquivo: " + (e?.message || e));
    }
  };

  // Função para ler o texto do arquivo
  const readFromFile = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        setSavedText("");
        return;
      }

      const content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setSavedText(content);
    } catch (e) {
      Alert.alert("Erro", "Erro ao ler arquivo: " + (e?.message || e));
    }
  };

  // Função para apagar o arquivo
  const deleteFile = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(fileUri);
        setSavedText("");
        Alert.alert("Sucesso", "Arquivo removido.");
      } else {
        Alert.alert("Aviso", "Nenhum arquivo para remover.");
      }
    } catch (e) {
      Alert.alert("Erro", "Erro ao remover arquivo: " + (e?.message || e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Armazenamento com Expo FileSystem</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite algo para salvar"
        value={inputText}
        onChangeText={setInputText}
      />

      <Button title="💾 Salvar no Arquivo" onPress={saveToFile} />

      <View style={{ height: 10 }} />

      <Button title="📖 Ler do Arquivo" onPress={readFromFile} />

      <View style={{ height: 10 }} />

      <Button title="🗑️ Apagar Arquivo" onPress={deleteFile} color="#d00" />

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
