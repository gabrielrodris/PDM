import React, { useRef } from "react";
import { View, Animated, PanResponder, StyleSheet } from "react-native";

// Componente principal
export default function App() {
  // Cria um valor animado 2D (x e y) que vai controlar a posição do quadrado
const pan = useRef(new Animated.ValueXY()).current;

  // Configura o PanResponder (responsável por detectar e responder a gestos de arrastar)
const panResponder = useRef(
    PanResponder.create({
      // Define que esse componente deve responder ao toque inicial
    onStartShouldSetPanResponder: () => true,

      // Mapeia o movimento do dedo (dx, dy) para os valores x e y do Animated.ValueXY
    onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }], // Atualiza pan.x e pan.y com o movimento
        { useNativeDriver: false } // Precisa ser false porque estamos animando layout (não suportado pelo driver nativo)
    ),
      // Quando o usuário solta o dedo, esse método é chamado
    onPanResponderRelease: () => {
        // No momento não faz nada, mas aqui você poderia animar de volta para (0,0)
    },
    })
).current;

  // Renderização do layout
return (
    <View style={styles.container}>
      {/* Quadrado animado que pode ser arrastado */}
    <Animated.View
        {...panResponder.panHandlers} // Liga o quadrado ao PanResponder
        style={[pan.getLayout(), styles.box]} // Aplica a posição animada + estilo
    />
    </View>
);
}

// Estilos da tela
const styles = StyleSheet.create({
container: {
    flex: 1, // Ocupa a tela toda
    backgroundColor: "#f0f0f0", // Cor de fundo
    alignItems: "center", // Centraliza na horizontal
    justifyContent: "center", // Centraliza na vertical
},
box: {
    width: 100, // Largura do quadrado
    height: 100, // Altura do quadrado
    backgroundColor: "tomato", // Cor vermelha do quadrado
    borderRadius: 10, // Bordas arredondadas
},
});