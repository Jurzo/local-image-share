import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StorageHandler } from '../util/StorageHandler';

export default function ImageSelector() {
  const [image, setImage] = useState(null);
  const [isCameraReady, setCameraReady] = useState(false);
  const storageHandler = useRef(new StorageHandler());

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera roll permission required for the app to work.');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      storageHandler.current.uploadImage(
        result.uri,
        'testi',
        { lat: 60.208439814123835, lng: 24.961578620225893 }
      );
    }
  }

  const takeImage = async () => {
    if (!isCameraReady) {
      const perm = await getCameraPermission();
      if (!perm) return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      storageHandler.current.uploadImage(
        result.uri,
        'testi',
        { lat: 60.208439814123835, lng: 24.961578620225893 }
      );
    }
  }

  const getCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required to take photos');
      return false;
    }
    setCameraReady(true);
    return true;
  }

  return (
    <View style={styles.buttonContainer}>
      <Button
        raised
        title='Add picture'
        onPress={pickImage}
      />
      <Button
        raised
        title='Take picture'
        onPress={takeImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    padding: 5,
    bottom: 28,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
});