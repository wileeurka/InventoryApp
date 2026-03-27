import React, { useEffect, useState, useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

interface CameraLabelFrameProps {
  onCodeScanned?: (code: string) => void;
}

const CameraLabelFrame: React.FC<CameraLabelFrameProps> = ({ onCodeScanned }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scanned = useRef(false);

  const labelOpacity = useRef(new Animated.Value(1)).current;
  const cameraOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(labelOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(cameraOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowCamera(true);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned.current) return;
    scanned.current = true;
    onCodeScanned?.(data.trim());
    setTimeout(() => {
      scanned.current = false;
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Animated.Image
          source={require("../../../assets/images/scan/label-code.webp")}
          style={[styles.content, { opacity: labelOpacity }]}
          resizeMode="contain"
        />

        {permission?.granted && (
          <Animated.View
            style={[styles.cameraWrapper, { opacity: cameraOpacity }]}
          >
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "code128", "code39", "ean13", "ean8", "itf14"],
              }}
              onBarcodeScanned={showCamera ? handleBarCodeScanned : undefined}
            />
          </Animated.View>
        )}

        <Image
          source={require("../../../assets/images/scan/camera-label-border.webp")}
          style={styles.border}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 331,
    height: 136,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "40%",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  content: {
    width: 295,
    height: 104,
    position: "absolute",
  },
  cameraWrapper: {
    width: "99%",
    height: "99%",
    borderRadius: 20,
    overflow: "hidden",
    position: "absolute",
  },
  camera: {
    width: "100%",
    height: "100%",
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

export default CameraLabelFrame;
