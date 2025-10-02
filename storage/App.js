import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async/async-storage";
import { FlatList } from "react-native/types_generated/index";

export default function App() {
  const[text, setText] = useState("");
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const value = await AsyncStorage.getItem("@my_items");
        if (value !== null) {
          setItens(JSON.parse(value));
        }
      } catch (e) {
        Alert.alert("Erro", "Nao foi possivel carregar os dados");
      }
    };
    loadData();
  }, []);

  const addItem = async () => {
    if (text.trim() === "") return;
    const newItens = [...itens, text.trim()];
    try {
      await AsyncStorage.setItens(
        "@my_items",
        JSON.stringify.stringify(newItens)
      );
      setItens(newItens);
      setText("");
    } catch (e) {
      Alert.alert("Erro", "Nao foi possivel salvar o item");
    }
  };

  const clearItens = async () => {
    try {
      await AsyncStorage.removeItem("@my_items");
      setItens([]);
      setText("");
    } catch (e) {
      Alert.alert("Erro", "Nao foi possivel limpar os dados");
    }
  };

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.title}>Lista Persistente </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite um item..."
        value={text}
        onChangeText={setText}
      ></TextInput>
    </View>
    <View style={styles.buttons}>
      <Button title="Adicionar" onPress={addItem}></Button>
      <Button title="Limpar" onPress={clearItens} color="red"></Button>
    </View>

    <FlatList data={itens}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index}) => {
      <View style={styles.listItem}>
        <Text>{index + 1}. {item}</Text>
      </View>
    }}
    ListEmptyComponent={<Text style={{ marginTop: 20}}>Nenhum item salvo</Text>}></FlatList>
    </>
  );
}

const styles = StyleSheet.create({
container: { flex:1, justifyContent:'flex-start', alignItems:'center',
padding:20, backgroundColor:'#f5f5f5' },
title: { fontSize:22, marginBottom:20, textAlign:'center' },
input: { width:'100%', borderColor:'#ccc', borderWidth:1, padding:10,
marginBottom:15, borderRadius:5 },
buttons: { flexDirection:'row', justifyContent:'space-between',
width:'100%', marginBottom:20 },
listItem: { width:'100%', padding:10, borderBottomColor:'#ccc',
borderBottomWidth:1 },
});