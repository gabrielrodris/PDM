import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Menu() {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleMenuPress = (link) => {
    // Animação de press
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

    Alert.alert(
      `Navegar para ${link}`,
      `Você será redirecionado para a tela de ${link}`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => console.log(`Navegando para ${link}`),
        },
      ]
    );
  };

  const getIconName = (itemName) => {
    switch (itemName) {
      case "Home":
        return "home";
      case "Perfil":
        return "person";
      case "Config":
        return "settings";
      default:
        return "ellipse";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress("Home")}
            activeOpacity={0.7}
          >
            <Ionicons name="home" size={24} color="#4ecdc4" />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress("Perfil")}
            activeOpacity={0.7}
          >
            <Ionicons name="person" size={24} color="#4ecdc4" />
            <Text style={styles.menuText}>Perfil</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress("Config")}
            activeOpacity={0.7}
          >
            <Ionicons name="settings" size={24} color="#4ecdc4" />
            <Text style={styles.menuText}>Config</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0f0f23",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1a1a2e",
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#2d2d44",
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
  },
  menuText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
