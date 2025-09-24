import React from "react";
import { SafeAreaView, FlatList, Text, StyleSheet, View } from "react-native";
export default function App() {
  const frutas = [
    { id: "1", nome: "🍎 Maçã" },
    { id: "2", nome: "🍌 Banana" },
    { id: "3", nome: "🍊 Laranja" },
    { id: "4", nome: "🍇 Uva" },
    { id: "5", nome: "🥭 Manga" },
    { id: "6", nome: "🍉 Melancia" },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.texto}>{item.nome}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Lista de frutas</Text>
      <FlatList
        data={frutas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      ></FlatList>
    </SafeAreaView>
  );
}

const styles = (StyleSheet.create = {
  item: {},
  texto: {},
});
