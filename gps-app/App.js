import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getLocation = async () => {
    //solicita permissao
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permissao de acesso à localização negada");
      return;
    }
    //pega a localização atual
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
  };

  useEffect(() => {
    getLocation();
  }, []);

  let text = "Buscando localização...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude} {"/n"}Longitude: ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Mapa - Localização</Text>
      <Button title="Atualizar Localização" onPress={getLocation} />

      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : location ? (
        <Text style={styles.location}>
          Latitude: {location.coords.latitude} {"\n"}
          Longitude: {location.coords.longitude}
        </Text>
      ) : (
        <Text>Carregando localização...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  location: {
    marginTop: 20,
    fontSize: 16,
  },
});
