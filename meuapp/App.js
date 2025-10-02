import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ToqueSimples from "./screens/ToqueSimples";
import Rotacao from "./screens/Rotacao";
import PinchZoom from "./screens/PinchZoom";
import FlatList from "./screens/FlatList";
import Gps from "./screens/Gps";
import Wifi from "./screens/Wifi";
import Som from "./screens/Som";
import Mapa from "./screens/Mapa";

const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <NavigationContainer>
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
        <Drawer.Screen name="Mapa" component={Mapa} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
