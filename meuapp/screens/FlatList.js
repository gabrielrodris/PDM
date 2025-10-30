import React, { useState } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [frutas, setFrutas] = useState([
    { id: "1", nome: "🍎 Maçã" },
    { id: "2", nome: "🍌 Banana" },
    { id: "3", nome: "🍊 Laranja" },
  ]);

  const [novaFruta, setNovaFruta] = useState("");
  // function adicionar frutas
  const adicionarFruta = () => {
    if (novaFruta.trim() === "") return;
    const nova = {
      // usa timestamp + random para reduzir chance de colisão de key
      id: `${Date.now().toString()}_${Math.floor(Math.random() * 100000)}`,
      nome: novaFruta,
    };
    setFrutas((prev) => [...prev, nova]);
    setNovaFruta("");
  };

  const removerFruta = (id) => {
    setFrutas((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.texto}>{item.nome}</Text>
      <TouchableOpacity
        style={styles.botaoExcluir}
        onPress={() => removerFruta(item.id)}
      >
        <Text style={styles.excluirTexto}>❌</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Lista de frutas</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite algo"
          value={novaFruta}
          onChangeText={setNovaFruta}
        />
        <TouchableOpacity style={styles.botao} onPress={adicionarFruta}>
          <Text style={styles.botaoTexto}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={frutas}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  botao: {
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  texto: {
    fontSize: 18,
  },
  botaoExcluir: {
    marginLeft: 10,
  },
  excluirTexto: {
    fontSize: 18,
    color: "red",
  },
});
