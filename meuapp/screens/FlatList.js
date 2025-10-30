import React, { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function App() {
  const [frutas, setFrutas] = useState([
    { id: "1", nome: "🍎 Maçã", cor: "#ff6b6b" },
    { id: "2", nome: "🍌 Banana", cor: "#ffd93d" },
    { id: "3", nome: "🍊 Laranja", cor: "#ff922b" },
    { id: "4", nome: "🍇 Uva", cor: "#a29bfe" },
    { id: "5", nome: "🍓 Morango", cor: "#ff7675" },
  ]);

  const [novaFruta, setNovaFruta] = useState("");
  const [scaleAnim] = useState(new Animated.Value(1));

  const adicionarFruta = () => {
    if (novaFruta.trim() === "") return;

    // Animação de pulso no botão
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const cores = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#ffd93d",
      "#a29bfe",
    ];
    const nova = {
      id: `${Date.now().toString()}_${Math.floor(Math.random() * 100000)}`,
      nome: novaFruta,
      cor: cores[Math.floor(Math.random() * cores.length)],
    };
    setFrutas((prev) => [nova, ...prev]);
    setNovaFruta("");
  };

  const removerFruta = (id) => {
    setFrutas((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.item,
        {
          backgroundColor: item.cor,
          transform: [{ scale: new Animated.Value(1) }],
        },
      ]}
    >
      <View style={styles.itemContent}>
        <Text style={styles.texto}>{item.nome}</Text>
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => removerFruta(item.id)}
        >
          <Text style={styles.excluirTexto}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>🍓 Lista de Frutas</Text>
        <Text style={styles.subtitulo}>
          {frutas.length} fruta{frutas.length !== 1 ? "s" : ""} na lista
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma fruta..."
          placeholderTextColor="#888"
          value={novaFruta}
          onChangeText={setNovaFruta}
          onSubmitEditing={adicionarFruta}
        />
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.botao,
              { opacity: novaFruta.trim() === "" ? 0.6 : 1 },
            ]}
            onPress={adicionarFruta}
            disabled={novaFruta.trim() === ""}
          >
            <Text style={styles.botaoTexto}>+ Adicionar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Lista */}
      <FlatList
        data={frutas}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>📝 Nenhuma fruta na lista</Text>
            <Text style={styles.emptySubtext}>
              Adicione frutas usando o campo acima!
            </Text>
          </View>
        }
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Toque em 🗑️ para remover uma fruta
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#2d2d44",
    color: "#ffffff",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  botao: {
    backgroundColor: "#4ecdc4",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 15,
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  botaoTexto: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  listaContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  item: {
    marginVertical: 6,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  texto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    flex: 1,
  },
  botaoExcluir: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  excluirTexto: {
    fontSize: 18,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#1a1a2e",
    borderRadius: 15,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  footer: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2d2d44",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
