import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface CameraFrameProps {
  onCodeScanned?: (code: string) => void;
}

const CameraFrame: React.FC<CameraFrameProps> = ({ onCodeScanned }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scanned = useRef(false);

  const qrOpacity = useRef(new Animated.Value(1)).current;
  const cameraOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCamera(true);

      Animated.timing(qrOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(cameraOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned.current) return;
    scanned.current = true;
    onCodeScanned?.(data);
    setTimeout(() => {
      scanned.current = false;
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {!showCamera && (
          <Animated.Image
            source={require("../../../assets/images/scan/qr-code.webp")}
            style={[styles.qr, { opacity: qrOpacity }]}
            resizeMode="contain"
          />
        )}

        {permission?.granted && (
          <Animated.View
            style={[styles.cameraWrapper, { opacity: cameraOpacity }]}
          >
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr", "code128", "ean13", "ean8"] }}
              onBarcodeScanned={showCamera ? handleBarCodeScanned : undefined}
            />
          </Animated.View>
        )}

        <Image
          source={require("../../../assets/images/scan/camera-border.webp")}
          style={styles.border}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 241,
    height: 241,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "25%",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  qr: {
    width: 200,
    height: 200,
    position: "absolute",
  },
  cameraWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    position: "absolute",
    marginTop: 1,
  },
  camera: {
    width: "100%",
    height: "99.5%",
  },
  border: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 1,
  },
});

export default CameraFrame;
