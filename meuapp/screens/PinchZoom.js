import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
export default function App() {
  const [scale] = useState(new Animated.Value(1));
  const [zoomText, setZoomText] = useState('1.00');
  const onPinchEvent = Animated.event([{ nativeEvent: { scale: scale } }], {
    useNativeDriver: true,
  });
  // Listen for scale changes and update zoomText
  React.useEffect(() => {
    const id = scale.addListener(({ value }) => {
      setZoomText(value.toFixed(2));
    });
    return () => {
      scale.removeListener(id);
    };
  }, [scale]);
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Faça pinch para aumentar/diminuir </Text>
        <PinchGestureHandler onGestureEvent={onPinchEvent}>
          <Animated.View
            style={[
              styles.box,
              {
                transform: [{ scale }],
              },
            ]}
          >
            <Text style={styles.title}>Zoom: {zoomText}x</Text>
          </Animated.View>
        </PinchGestureHandler>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  box: {
    width: 250,
    height: 250,
    backgroundColor: "#1E90FF",
    borderRadius: 12,
  },
  title:{
    color: "white",
    fontWeight: "bold",
  },
  button: {
    marginTop: 20,
  }
});
