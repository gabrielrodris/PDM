import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const fileUri = FileSystem.documentDirectory + "meuArquivo.txt";

  useEffect(() => {
    readFromFile();

    // Animações após carregar
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const saveToFile = async () => {
    if (!inputText.trim()) {
      Alert.alert("Atenção", "Digite algo para salvar!");
      return;
    }

    try {
      await FileSystem.writeAsStringAsync(fileUri, inputText, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      Alert.alert("✅ Sucesso", "Arquivo salvo com sucesso!");
      setInputText("");
      readFromFile();
    } catch (e) {
      Alert.alert("❌ Erro", "Erro ao salvar arquivo: " + (e?.message || e));
    }
  };

  const readFromFile = async () => {
    try {
      const info = await FileSystem.getInfoAsync(fileUri);
      setFileInfo(info);

      if (!info.exists) {
        setSavedText("");
        return;
      }

      const content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setSavedText(content);
    } catch (e) {
      Alert.alert("❌ Erro", "Erro ao ler arquivo: " + (e?.message || e));
    }
  };

  const deleteFile = async () => {
    try {
      const info = await FileSystem.getInfoAsync(fileUri);
      if (info.exists) {
        Alert.alert(
          "🗑️ Apagar Arquivo",
          "Tem certeza que deseja excluir este arquivo?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Excluir",
              style: "destructive",
              onPress: async () => {
                await FileSystem.deleteAsync(fileUri);
                setSavedText("");
                setFileInfo(null);
                Alert.alert("✅ Sucesso", "Arquivo removido com sucesso!");
              },
            },
          ]
        );
      } else {
        Alert.alert("ℹ️ Aviso", "Nenhum arquivo encontrado para remover.");
      }
    } catch (e) {
      Alert.alert("❌ Erro", "Erro ao remover arquivo: " + (e?.message || e));
    }
  };

  const getFileSize = () => {
    if (!fileInfo?.exists) return "0 KB";
    const sizeInKB = (fileInfo.size / 1024).toFixed(2);
    return `${sizeInKB} KB`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Ionicons name="document-text" size={40} color="#4ecdc4" />
        <Text style={styles.title}>Gerenciador de Arquivos</Text>
        <Text style={styles.subtitle}>Armazenamento local com FileSystem</Text>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Input Section */}
        <Animated.View
          style={[
            styles.inputSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Escreva seu conteúdo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite algo para salvar no arquivo..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.saveButton, { opacity: inputText.trim() ? 1 : 0.6 }]}
            onPress={saveToFile}
            disabled={!inputText.trim()}
          >
            <Ionicons name="save" size={20} color="#ffffff" />
            <Text style={styles.saveButtonText}>Salvar no Arquivo</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* File Info */}
        <Animated.View
          style={[
            styles.infoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Informações do Arquivo</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="document" size={16} color="#4ecdc4" />
                <Text style={styles.infoLabel}>Status:</Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: fileInfo?.exists ? "#4ecdc4" : "#ff6b6b" },
                  ]}
                >
                  {fileInfo?.exists
                    ? "Arquivo Existe"
                    : "Arquivo Não Encontrado"}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="analytics" size={16} color="#4ecdc4" />
                <Text style={styles.infoLabel}>Tamanho:</Text>
                <Text style={styles.infoValue}>{getFileSize()}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="folder" size={16} color="#4ecdc4" />
                <Text style={styles.infoLabel}>Local:</Text>
                <Text style={styles.infoValue}>Document Directory</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View
          style={[
            styles.actionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Ações</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={readFromFile}
            >
              <Ionicons name="eye" size={24} color="#4ecdc4" />
              <Text style={styles.actionText}>Ler Arquivo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={deleteFile}
            >
              <Ionicons name="trash" size={24} color="#ff6b6b" />
              <Text style={[styles.actionText, styles.deleteText]}>
                Excluir
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Saved Content */}
        <Animated.View
          style={[
            styles.contentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Conteúdo Salvo</Text>
          <View style={styles.contentCard}>
            {savedText ? (
              <ScrollView style={styles.contentScroll}>
                <Text style={styles.savedText}>{savedText}</Text>
              </ScrollView>
            ) : (
              <View style={styles.emptyContent}>
                <Ionicons name="document-text-outline" size={40} color="#888" />
                <Text style={styles.emptyText}>Nenhum conteúdo salvo</Text>
                <Text style={styles.emptySubtext}>
                  Escreva algo e salve para ver o conteúdo aqui
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 20,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  inputSection: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#1a1a2e",
    color: "#ffffff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2d2d44",
    fontSize: 16,
    minHeight: 100,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4ecdc4",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  infoSection: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    color: "#888",
    fontSize: 12,
    marginLeft: 6,
    marginRight: 4,
  },
  infoValue: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  actionsSection: {
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a2e",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4ecdc4",
  },
  deleteButton: {
    borderColor: "#ff6b6b",
  },
  actionText: {
    color: "#4ecdc4",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  deleteText: {
    color: "#ff6b6b",
  },
  contentSection: {
    paddingHorizontal: 25,
  },
  contentCard: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 20,
    minHeight: 150,
  },
  contentScroll: {
    flex: 1,
  },
  savedText: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  emptySubtext: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
});
