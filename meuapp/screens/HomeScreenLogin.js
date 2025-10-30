import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
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

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate("Login");
  };

  const userEmail = auth.currentUser?.email;
  const userName = userEmail?.split("@")[0] || "Usuário";

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
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#4ecdc4" />
        </View>
        <Text style={styles.welcomeText}>Olá, {userName}! 👋</Text>
        <Text style={styles.emailText}>{userEmail}</Text>
      </Animated.View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="#4ecdc4" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Atividades</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#ffd93d" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Conquistas</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#ff6b6b" />
            <Text style={styles.statNumber}>8h</Text>
            <Text style={styles.statLabel}>Tempo</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings" size={20} color="#4ecdc4" />
            <Text style={styles.actionText}>Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle" size={20} color="#4ecdc4" />
            <Text style={styles.actionText}>Ajuda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="person" size={20} color="#4ecdc4" />
            <Text style={styles.actionText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Logout Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#ff6b6b" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
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
    paddingTop: 40,
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 20,
    borderRadius: 15,
    flex: 0.3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  quickActions: {
    backgroundColor: "#1a1a2e",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2d2d44",
  },
  actionText: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    padding: 25,
    borderTopWidth: 1,
    borderTopColor: "#2d2d44",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  logoutText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
