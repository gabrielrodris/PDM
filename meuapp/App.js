import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreenLogin from "./screens/HomeScreenLogin";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ToqueSimples from "./screens/ToqueSimples";
import Rotacao from "./screens/Rotacao";
import PinchZoom from "./screens/PinchZoom";
import FlatList from "./screens/FlatList";
import ArrastarDrag from "./screens/ArrastarDrag";
import Gps from "./screens/Gps";
import Wifi from "./screens/Wifi";
import Som from "./screens/Som";
import Storage from "./screens/Storage";
import Camera from "./screens/Camera";
import Acelerometro from "./screens/Acelerometro";
import StorageExternal from "./screens/StorageExternal";
import Mapa from "./screens/Mapa";
import Menu from "./screens/Menu";

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();

// Icon mapping for drawer items
const getDrawerIcon = (routeName, focused, color, size) => {
  let iconName;

  switch (routeName) {
    case "Início":
      iconName = focused ? "home" : "home-outline";
      break;
    case "Configurações":
      iconName = focused ? "settings" : "settings-outline";
      break;
    case "Toque Simples":
      iconName = focused ? "finger-print" : "finger-print-outline";
      break;
    case "Mapa":
      iconName = focused ? "map" : "map-outline";
      break;
    case "Menu":
      iconName = focused ? "menu" : "menu-outline";
      break;
    case "Arrastar Drag":
      iconName = focused ? "move" : "move-outline";
      break;
    case "Rotação":
      iconName = focused ? "sync" : "sync-outline";
      break;
    case "Pinch e Zoom":
      iconName = focused ? "search" : "search-outline";
      break;
    case "FlatList":
      iconName = focused ? "list" : "list-outline";
      break;
    case "Gps":
      iconName = focused ? "navigate" : "navigate-outline";
      break;
    case "Wi-fi":
      iconName = focused ? "wifi" : "wifi-outline";
      break;
    case "Som":
      iconName = focused ? "musical-notes" : "musical-notes-outline";
      break;
    case "Storage":
      iconName = focused ? "save" : "save-outline";
      break;
    case "Camera":
      iconName = focused ? "camera" : "camera-outline";
      break;
    case "Acelerometro":
      iconName = focused ? "speedometer" : "speedometer-outline";
      break;
    case "StorageExternal":
      iconName = focused ? "document" : "document-outline";
      break;
    default:
      iconName = focused ? "square" : "square-outline";
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#0f0f23",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerStyle: {
          backgroundColor: "#0f0f23",
          width: 280,
        },
        drawerActiveTintColor: "#4ecdc4",
        drawerInactiveTintColor: "#888",
        drawerActiveBackgroundColor: "rgba(78, 205, 196, 0.1)",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "500",
          marginLeft: -16,
        },
        drawerIcon: ({ focused, color, size }) =>
          getDrawerIcon(route.name, focused, color, size),
      })}
    >
      <Drawer.Screen
        name="Início"
        component={HomeScreen}
        options={{
          title: "🏠 Início",
          drawerLabel: "Início",
        }}
      />
      <Drawer.Screen
        name="Configurações"
        component={SettingsScreen}
        options={{
          title: "⚙️ Configurações",
          drawerLabel: "Configurações",
        }}
      />

      {/* Gestos e Interações */}
      <Drawer.Group
        screenOptions={{
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#4ecdc4",
            marginLeft: -16,
            marginTop: 10,
          },
        }}
      >
        <Drawer.Screen
          name="Toque Simples"
          component={ToqueSimples}
          options={{
            title: "👆 Toque Simples",
          }}
        />
        <Drawer.Screen
          name="Arrastar Drag"
          component={ArrastarDrag}
          options={{
            title: "↔️ Arrastar",
          }}
        />
        <Drawer.Screen
          name="Rotação"
          component={Rotacao}
          options={{
            title: "🔄 Rotação",
          }}
        />
        <Drawer.Screen
          name="Pinch e Zoom"
          component={PinchZoom}
          options={{
            title: "🔍 Pinch & Zoom",
          }}
        />
      </Drawer.Group>

      {/* Sensores e Hardware */}
      <Drawer.Group
        screenOptions={{
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#4ecdc4",
            marginLeft: -16,
            marginTop: 10,
          },
        }}
      >
        <Drawer.Screen
          name="Gps"
          component={Gps}
          options={{
            title: "📍 GPS",
          }}
        />
        <Drawer.Screen
          name="Acelerometro"
          component={Acelerometro}
          options={{
            title: "📱 Acelerômetro",
          }}
        />
        <Drawer.Screen
          name="Camera"
          component={Camera}
          options={{
            title: "📷 Câmera",
          }}
        />
        <Drawer.Screen
          name="Wi-fi"
          component={Wifi}
          options={{
            title: "📶 Wi-Fi",
          }}
        />
        <Drawer.Screen
          name="Som"
          component={Som}
          options={{
            title: "🔊 Áudio",
          }}
        />
      </Drawer.Group>

      {/* Dados e Armazenamento */}
      <Drawer.Group
        screenOptions={{
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#4ecdc4",
            marginLeft: -16,
            marginTop: 10,
          },
        }}
      >
        <Drawer.Screen
          name="Storage"
          component={Storage}
          options={{
            title: "💾 Storage",
          }}
        />
        <Drawer.Screen
          name="StorageExternal"
          component={StorageExternal}
          options={{
            title: "📁 FileSystem",
          }}
        />
        <Drawer.Screen
          name="FlatList"
          component={FlatList}
          options={{
            title: "📋 Lista",
          }}
        />
      </Drawer.Group>

      {/* UI Components */}
      <Drawer.Group
        screenOptions={{
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#4ecdc4",
            marginLeft: -16,
            marginTop: 10,
          },
        }}
      >
        <Drawer.Screen
          name="Mapa"
          component={Mapa}
          options={{
            title: "🗺️ Mapa",
          }}
        />
        <Drawer.Screen
          name="Menu"
          component={Menu}
          options={{
            title: "🍔 Menu",
          }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f0f23",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        cardStyle: {
          backgroundColor: "#0f0f23",
        },
      }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="HomeScreenLogin"
        component={HomeScreenLogin}
        options={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="Auth" component={AuthStackScreen} />
        <RootStack.Screen name="Main" component={MainDrawer} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
