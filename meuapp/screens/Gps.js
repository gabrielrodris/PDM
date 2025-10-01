import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Location from "expo-location"; // Biblioteca do Expo para GPS

export default function App() {
  // Estado para armazenar a localização atual
  const [location, setLocation] = useState(null);
  // Estado para armazenar mensagens de erro
  const [errorMsg, setErrorMsg] = useState(null);
  // Estado para armazenar a assinatura do rastreamento (watchPositionAsync)
  const [subscription, setSubscription] = useState(null);
  // Estado para indicar se o rastreamento está ativo ou não
  const [isTracking, setIsTracking] = useState(false);

  // Função para pegar a localização atual apenas uma vez
  const getLocation = async () => {
    try {
      // Solicita permissão do usuário para acessar a localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização negada ❌");
        return;
      }

      // Obtém a posição atual do usuário
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    } catch (error) {
      // Caso ocorra algum erro, exibe na tela
      setErrorMsg("Erro ao buscar localização: " + error.message);
    }
  };

  // Função para iniciar rastreamento contínuo
  const startTracking = async () => {
    try {
      // Solicita permissão novamente (pode já estar concedida)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização negada ❌");
        return;
      }

      // Cria uma assinatura que atualiza a localização em tempo real
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // Maior precisão possível
          timeInterval: 3000, // Atualiza a cada 3 segundos
          distanceInterval: 1, // Ou a cada 1 metro percorrido
        },
        (loc) => {
          setLocation(loc); // Atualiza o estado da localização
        }
      );

      setSubscription(sub); // Armazena a assinatura para poder parar depois
      setIsTracking(true); // Atualiza o status do rastreamento
    } catch (error) {
      setErrorMsg("Erro ao iniciar rastreamento: " + error.message);
    }
  };

  // Função para parar o rastreamento contínuo
  const stopTracking = () => {
    if (subscription) {
      subscription.remove(); // Remove a assinatura do watchPositionAsync
      setSubscription(null); // Limpa o estado
      setIsTracking(false); // Atualiza o status
      console.log("Rastreamento parado.");
    }
  };

  // useEffect é executado quando o componente é montado
  useEffect(() => {
    getLocation(); // Obtém localização inicial
    // Limpa a assinatura caso o componente seja desmontado
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Título do app */}
      <Text style={styles.title}>📍 Mapa - Localização</Text>

      {/* Botão para pegar localização atual */}
      <View style={styles.button}>
        <Button title="Obter Localização Atual" onPress={getLocation} />
      </View>

      {/* Botão para iniciar rastreamento */}
      <View style={styles.button}>
        <Button title="Iniciar Rastreamento" onPress={startTracking} />
      </View>

      {/* Botão para parar rastreamento */}
      <View style={styles.button}>
        <Button title="Parar Rastreamento" onPress={stopTracking} />
      </View>

      {/* Status do rastreamento (ativo ou parado) */}
      <Text style={[styles.status, { color: isTracking ? "green" : "red" }]}>
        {isTracking ? "🟢 Rastreamento ativo" : "🔴 Rastreamento parado"}
      </Text>

      {/* Exibe erros ou localização */}
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : location ? (
        <Text style={styles.location}>
          Latitude: {location.coords.latitude.toFixed(6)} {"\n"}
          Longitude: {location.coords.longitude.toFixed(6)}
        </Text>
      ) : (
        <Text>Carregando localização...</Text>
      )}
    </View>
  );
}

// Estilos do app
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
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  location: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    width: "80%", // Todos os botões têm a mesma largura
    marginVertical: 5,
  },
  status: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});
