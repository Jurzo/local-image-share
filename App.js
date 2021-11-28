import React, { useEffect, useRef, useState } from 'react';
import { LogBox, StyleSheet, View } from 'react-native';
import { ImageViewer } from './components/ImageViewer';
import Map from './components/Map';
import { StorageHandler } from './util/StorageHandler';

export default function App() {
  const [image, setImage] = useState(null);
  const storageHandlerRef = useRef(new StorageHandler());

  const closeImage = () => {
    setImage(null);
  }

  useEffect(()=> {
    LogBox.ignoreLogs(['Setting a timer']);
  },[]);

  // move everything to map so that it can be updated when an image is uploaded
  return (
    <View style={styles.container}>
      <Map
        storageHandler={storageHandlerRef.current}
        setViewImage={setImage}
      />
      {image ? <ImageViewer image={image} closeImage={closeImage} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
