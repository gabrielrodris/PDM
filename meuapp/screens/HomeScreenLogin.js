import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate("Login");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bem-vindo,
        {auth.currentUser?.email}
      </Text>
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 20 },
});
