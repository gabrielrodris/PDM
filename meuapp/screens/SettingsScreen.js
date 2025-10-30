import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const [biometric, setBiometric] = React.useState(false);
  const [autoSave, setAutoSave] = React.useState(true);

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

  const SettingItem = ({ icon, title, subtitle, rightComponent, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#4ecdc4" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

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
        <View style={styles.headerContent}>
          <Ionicons name="settings" size={32} color="#4ecdc4" />
          <Text style={styles.title}>Configurações</Text>
          <Text style={styles.subtitle}>Personalize sua experiência</Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferências */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Preferências</Text>

          <SettingItem
            icon="notifications"
            title="Notificações"
            subtitle="Receber alertas e atualizações"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#2d2d44", true: "#4ecdc4" }}
                thumbColor={notifications ? "#ffffff" : "#888"}
              />
            }
          />

          <SettingItem
            icon="moon"
            title="Modo Escuro"
            subtitle="Tema escuro para melhor visualização"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#2d2d44", true: "#4ecdc4" }}
                thumbColor={darkMode ? "#ffffff" : "#888"}
              />
            }
          />

          <SettingItem
            icon="finger-print"
            title="Biometria"
            subtitle="Usar impressão digital para login"
            rightComponent={
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                trackColor={{ false: "#2d2d44", true: "#4ecdc4" }}
                thumbColor={biometric ? "#ffffff" : "#888"}
              />
            }
          />

          <SettingItem
            icon="save"
            title="Salvamento Automático"
            subtitle="Salvar alterações automaticamente"
            rightComponent={
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: "#2d2d44", true: "#4ecdc4" }}
                thumbColor={autoSave ? "#ffffff" : "#888"}
              />
            }
          />
        </Animated.View>

        {/* Conta */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Conta</Text>

          <SettingItem
            icon="person"
            title="Perfil"
            subtitle="Editar informações pessoais"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#888" />
            }
          />

          <SettingItem
            icon="lock-closed"
            title="Privacidade"
            subtitle="Configurar privacidade e segurança"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#888" />
            }
          />

          <SettingItem
            icon="card"
            title="Assinatura"
            subtitle="Gerenciar plano premium"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#888" />
            }
          />
        </Animated.View>

        {/* Suporte */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Suporte</Text>

          <SettingItem
            icon="help-circle"
            title="Ajuda & Suporte"
            subtitle="Central de ajuda e FAQ"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#888" />
            }
          />

          <SettingItem
            icon="document-text"
            title="Termos de Uso"
            subtitle="Termos e condições do serviço"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#888" />
            }
          />

          <SettingItem
            icon="shield-checkmark"
            title="Política de Privacidade"
            subtitle="Como protegemos seus dados"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#888" />
            }
          />

          <SettingItem
            icon="information-circle"
            title="Sobre o App"
            subtitle="Versão 1.0.0 - Desenvolvido com ❤️"
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color="#888" />
            }
          />
        </Animated.View>

        {/* Ações */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Ações</Text>

          <TouchableOpacity style={styles.dangerButton}>
            <Ionicons name="log-out" size={20} color="#ff6b6b" />
            <Text style={styles.dangerButtonText}>Sair da Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton}>
            <Ionicons name="trash" size={20} color="#ff6b6b" />
            <Text style={styles.dangerButtonText}>Excluir Conta</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Espaço no final */}
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
    marginLeft: 25,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a2e",
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#4ecdc4",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(78, 205, 196, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#888",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#ff6b6b",
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff6b6b",
    marginLeft: 10,
  },
  spacer: {
    height: 30,
  },
});
