import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { RotationGestureHandler } from "react-native-gesture-handler";

export default function App() {
  const [rotate] = useState(new Animated.Value(0));
  const [angle, setAngle] = useState(0);

  const onRotateEvent = Animated.event(
    [{ nativeEvent: { rotation: rotate } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        let raw = event.nativeEvent.rotation;
        // Limita entre -π e π
        if (raw > Math.PI) raw = Math.PI;
        if (raw < -Math.PI) raw = -Math.PI;
        setAngle(raw * (180 / Math.PI));
        rotate.setValue(raw);
      },
    }
  );

 
  const boxColor = Math.abs(angle) >= 90 ? "#1E90FF" : "#32CD32";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gire o quadrado com dois dedos </Text>
      <RotationGestureHandler onGestureEvent={onRotateEvent}>
        <Animated.View
          style={[
            styles.box,
            {
              backgroundColor: boxColor,
              transform: [
                {
                  rotate: rotate.interpolate({
                    inputRange: [-Math.PI, Math.PI],
                    outputRange: ["-180deg", "180deg"],
                  }),
                },
              ],
            },
          ]}
        ></Animated.View>
      </RotationGestureHandler>
      <Text style={styles.angleText}></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  box: {
    width: 250,
    height: 250,
    backgroundColor: "#32CD32",
    borderRadius: 12,
  },
  angleText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
});
