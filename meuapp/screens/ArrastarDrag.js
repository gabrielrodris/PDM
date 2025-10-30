import React, { useRef } from "react";
import { View, Animated, PanResponder, StyleSheet, Text, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function App() {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          tension: 40,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const rotateX = pan.x.interpolate({
    inputRange: [-width/2, 0, width/2],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp'
  });

  const rotateY = pan.y.interpolate({
    inputRange: [-height/2, 0, height/2],
    outputRange: ['30deg', '0deg', '-30deg'],
    extrapolate: 'clamp'
  });

  const backgroundColor = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    extrapolate: 'clamp'
  });

  const shadowOpacity = pan.x.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [0.8, 0.3, 0.8],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Arraste o Cubo</Text>
      <Text style={styles.subtitle}>Solte para voltar ao centro</Text>
      
      <View style={styles.area}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            pan.getLayout(),
            styles.box,
            {
              backgroundColor,
              transform: [
                { rotateX },
                { rotateY },
                { perspective: 1000 }
              ],
              shadowOpacity,
            }
          ]}
        >
          <Text style={styles.boxText}>Drag Me</Text>
        </Animated.View>
      </View>

      <View style={styles.coordinates}>
        <Text style={styles.coordText}>
          X: {Math.round(pan.x._value)} | Y: {Math.round(pan.y._value)}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>✨ Toque e arraste para mover</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
  },
  area: {
    width: width - 40,
    height: height * 0.6,
    borderWidth: 2,
    borderColor: '#2d2d44',
    borderRadius: 20,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    marginBottom: 20,
  },
  box: {
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 20,
    elevation: 15,
  },
  boxText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  coordinates: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  coordText: {
    color: '#4ecdc4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
});