import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]); // ✅ Corrigido aqui

  useEffect(() => {
    const loadData = async () => {
      try {
        const value = await AsyncStorage.getItem("@my_items");
        if (value !== null) {
          setItems(JSON.parse(value));
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar os dados");
      }
    };
    loadData();
  }, []);

  const addItem = async () => {
    if (text.trim() === "") return;

    const newItems = [...items, text.trim()];

    try {
      await AsyncStorage.setItem("@my_items", JSON.stringify(newItems));
      setItems(newItems);
      setText(""); // ✅ Corrigido aqui
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o item");
    }
  };

  const clearItems = async () => {
    try {
      await AsyncStorage.removeItem("@my_items");
      setItems([]);
      setText("");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível limpar os dados");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista Persistente</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite um item..."
        value={text}
        onChangeText={setText}
      />

      <View style={styles.buttons}>
        <Button title="Adicionar" onPress={addItem} />
        <Button title="Limpar" onPress={clearItems} color="red" />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listaItem}>
            <Text>
              {index + 1}. {item}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ marginTop: 20 }}>Nenhum item salvo</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  listaItem: {
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
});
