import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Animated } from "react-native";
import CustomButton from "../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
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

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="home" size={40} color="#4ecdc4" />
        </View>
        <Text style={styles.title}>Bem-vindo ao App!</Text>
        <Text style={styles.subtitle}>
          Sua experiência incrível começa aqui
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.featureGrid}>
          <View style={styles.featureItem}>
            <Ionicons name="rocket" size={24} color="#4ecdc4" />
            <Text style={styles.featureText}>Rápido</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={24} color="#4ecdc4" />
            <Text style={styles.featureText}>Seguro</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="flash" size={24} color="#4ecdc4" />
            <Text style={styles.featureText}>Moderno</Text>
          </View>
        </View>

        <CustomButton
          text="Explorar Agora"
          onPress={() => alert("Bem-vindo à jornada! 🚀")}
          icon="arrow-forward"
          style={styles.customButton}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            💡 Toque no botão para começar sua experiência
          </Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 1.0 • Desenvolvido com ❤️</Text>
      </View>
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
    paddingTop: 60,
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  featureGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  featureItem: {
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 15,
    borderRadius: 15,
    flex: 0.3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  featureText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },
  customButton: {
    marginBottom: 30,
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  infoContainer: {
    backgroundColor: "#1a1a2e",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#4ecdc4",
  },
  infoText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
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
  },
});
