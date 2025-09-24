import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ToqueSimples from "./screens/ToqueSimples";
import Rotacao from "./screens/Rotacao";
import PinchZoom from "./screens/PinchZoom";
import FlatList from "./screens/FlatList";

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
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
