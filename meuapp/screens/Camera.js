import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [photo, setPhoto] = useState(null);
  const [mediaPermission, setMediaPermission] = useState(null);
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(mediaStatus);
    })();
  }, []);

  if (!cameraPermission) return <View />;

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text>Precisamos da permissão para usar a câmera</Text>
        <Button title="Conceder permissão" onPress={requestCameraPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);
      if (mediaPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(photoData.uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
              activeOpacity={0.7}
            >
              <Text style={{ color: "black", fontWeight: "bold" }}>Foto</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <Button title="Tirar outra foto" onPress={() => setPhoto(null)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  camera: { flex: 1, width: "100%" },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 50,
  },
  previewContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  preview: {
    width: "90%",
    height: "70%",
    borderRadius: 10,
    marginBottom: 20,
  },
});
