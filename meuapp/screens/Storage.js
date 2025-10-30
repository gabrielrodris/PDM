import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    const loadData = async () => {
      try {
        const value = await AsyncStorage.getItem("@my_items");
        if (value !== null) {
          setItems(JSON.parse(value));
        }

        // Animações após carregar os dados
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
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar os dados");
      }
    };
    loadData();
  }, []);

  const addItem = async () => {
    if (text.trim() === "") {
      Alert.alert("Atenção", "Digite um item antes de adicionar!");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      text: text.trim(),
      createdAt: new Date().toLocaleString("pt-BR"),
    };

    const newItems = [newItem, ...items];

    try {
      await AsyncStorage.setItem("@my_items", JSON.stringify(newItems));
      setItems(newItems);
      setText("");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o item");
    }
  };

  const removeItem = async (id) => {
    const newItems = items.filter((item) => item.id !== id);

    try {
      await AsyncStorage.setItem("@my_items", JSON.stringify(newItems));
      setItems(newItems);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível remover o item");
    }
  };

  const clearItems = async () => {
    Alert.alert(
      "Limpar Lista",
      "Tem certeza que deseja remover todos os itens?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("@my_items");
              setItems([]);
              setText("");
            } catch (e) {
              Alert.alert("Erro", "Não foi possível limpar os dados");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.listItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemNumber}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>{item.text}</Text>
          <Text style={styles.itemDate}>{item.createdAt}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeItem(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
          <Ionicons name="list" size={32} color="#4ecdc4" />
          <Text style={styles.title}>Lista Persistente</Text>
          <Text style={styles.subtitle}>
            {items.length} item{items.length !== 1 ? "s" : ""} salvos localmente
          </Text>
        </Animated.View>

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
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Digite um novo item..."
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
              onSubmitEditing={addItem}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                { opacity: text.trim() === "" ? 0.6 : 1 },
              ]}
              onPress={addItem}
              disabled={text.trim() === ""}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {items.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearItems}>
              <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
              <Text style={styles.clearButtonText}>Limpar Tudo</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* List */}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View
              style={[
                styles.emptyState,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Ionicons name="document-text-outline" size={80} color="#888" />
              <Text style={styles.emptyTitle}>Lista Vazia</Text>
              <Text style={styles.emptyText}>
                Adicione itens usando o campo acima!
              </Text>
            </Animated.View>
          }
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            💡 Os dados são salvos localmente no dispositivo
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  keyboardView: {
    flex: 1,
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
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  inputSection: {
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    color: "#ffffff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2d2d44",
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#4ecdc4",
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff6b6b",
    alignSelf: "flex-start",
  },
  clearButtonText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    marginBottom: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4ecdc4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  numberText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemDate: {
    color: "#888",
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#2d2d44",
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
});
