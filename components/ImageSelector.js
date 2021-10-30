import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

export default function ImageSelector({ setImage }) {
  const [isCameraReady, setCameraReady] = useState(false);
  const [isGalleryReady, setGalleryReady] = useState(false);

  const pickImage = async () => {
    if (!isGalleryReady) {
      const perm = await getGalleryPermission();
      if (!perm) return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  const getGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync;
    if (status !== 'granted') {
      alert('Permission required to take photos');
      return false;
    }
    setGalleryReady(true);
    return true;
  }

  const takeImage = async () => {
    if (!isCameraReady) {
      const perm = await getCameraPermission();
      if (!perm) return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      setImage(result.uri);
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
      <Text
        style={styles.infoText}
        h4
      >
        Gallery
      </Text>
      <Icon
        name='source'
        reverse
        onPress={pickImage}
      />
      <Icon
        name='camera'
        reverse
        onPress={takeImage}
      />
      <Text
        style={styles.infoText}
        h4
      >
        Camera
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    padding: 5,
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: 'rgba(0.1,0.1,0.1,0.5)',
  },
  infoText: {
    color: 'white'
  }
});