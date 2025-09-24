import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
export default function App() {
  const [scale] = useState(new Animated.Value(1));
  const onPinchEvent = Animated.event([{ nativeEvent: { scale: scale } }], {
    useNativeDriver: true,
  });
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Faça pinch para aumentar/diminuir </Text>

        <PinchGestureHandler onGestureEvent={onPinchEvent} on>
          <Animated.View
            style={[
              styles.box,
              {
                transform: [{ scale }],
              },
            ]}
          >
            <Text style={styles.title}>Zoom:{scale.__getValue().toFixed(2)
                }x</Text>
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
    width: 150,
    height: 150,
    backgroundColor: "#1E90FF",
    borderRadius: 12,
  },
});
