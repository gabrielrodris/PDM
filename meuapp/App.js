import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreenLogin from "./screens/HomeScreenLogin";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ToqueSimples from "./screens/ToqueSimples";
import Rotacao from "./screens/Rotacao";
import PinchZoom from "./screens/PinchZoom";
import FlatList from "./screens/FlatList";
import Gps from "./screens/Gps";
import Wifi from "./screens/Wifi";
import Som from "./screens/Som";
import Storage from "./screens/Storage";
import Camera from "./screens/Camera";
import Acelerometro from "./screens/Acelerometro";
import StorageExternal from "./screens/StorageExternal";

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Início" component={HomeScreen} />
      <Drawer.Screen name="Configurações" component={SettingsScreen} />
      <Drawer.Screen name="Toque Simples" component={ToqueSimples} />
      <Drawer.Screen name="Rotação" component={Rotacao} />
      <Drawer.Screen name="Pinch e Zoom" component={PinchZoom} />
      <Drawer.Screen name="FlatList" component={FlatList} />
      <Drawer.Screen name="Gps" component={Gps} />
      <Drawer.Screen name="Wi-fi" component={Wifi} />
      <Drawer.Screen name="Som" component={Som} />
      <Drawer.Screen name="Storage" component={Storage} />
      <Drawer.Screen name="Camera" component={Camera} />
      <Drawer.Screen name="Acelerometro" component={Acelerometro} />
      <Drawer.Screen name="StorageExternal" component={StorageExternal} />
    </Drawer.Navigator>
  );
}

function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="HomeScreenLogin" component={HomeScreenLogin} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Auth" component={AuthStackScreen} />
        <RootStack.Screen name="Main" component={MainDrawer} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
