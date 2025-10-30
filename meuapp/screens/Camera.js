import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [photo, setPhoto] = useState(null);
  const [mediaPermission, setMediaPermission] = useState(null);
  const [flash, setFlash] = useState("off");
  const [cameraType, setCameraType] = useState("back");
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(mediaStatus);
    })();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [photo]);

  if (!cameraPermission) return <View />;

  if (!cameraPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={80} color="#4ecdc4" />
        <Text style={styles.permissionTitle}>Permissão da Câmera</Text>
        <Text style={styles.permissionText}>
          Precisamos da sua permissão para usar a câmera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
        </TouchableOpacity>
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

  const toggleFlash = () => {
    setFlash(flash === "on" ? "off" : "on");
  };

  const toggleCameraType = () => {
    setCameraType(cameraType === "back" ? "front" : "back");
  };

  return (
    <SafeAreaView style={styles.container}>
      {!photo ? (
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          flash={flash}
          facing={cameraType}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              <Ionicons
                name={flash === "on" ? "flash" : "flash-off"}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.captureContainer}>
              <TouchableOpacity
                onPress={takePicture}
                style={styles.captureButton}
                activeOpacity={0.8}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      ) : (
        <Animated.View style={[styles.previewContainer, { opacity: fadeAnim }]}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Foto Capturada 📸</Text>
          </View>

          <Image source={{ uri: photo }} style={styles.preview} />

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setPhoto(null)}
            >
              <Ionicons name="camera" size={20} color="white" />
              <Text style={styles.retakeButtonText}>Nova Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setPhoto(null)}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveButtonText}>Usar Foto</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f23",
    padding: 30,
  },
  permissionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: "#4ecdc4",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  header: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    zIndex: 10,
  },
  flashButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  flipButton: {
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureContainer: {
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.2)",
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.1)",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  previewHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: "#1a1a2e",
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  preview: {
    flex: 1,
    width: width - 40,
    margin: 20,
    borderRadius: 20,
    backgroundColor: "#1a1a2e",
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: "#1a1a2e",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 0.48,
    justifyContent: "center",
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retakeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4ecdc4",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 0.48,
    justifyContent: "center",
    shadowColor: "#4ecdc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
