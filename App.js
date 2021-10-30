import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ImageSelector from './components/ImageSelector';
import Map from './components/Map';
import Upload from './components/Upload';
import { StorageHandler } from './util/StorageHandler';

export default function App() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({
    latitude: undefined,
    longitude: undefined
  });
  const storageHandlerRef = useRef(new StorageHandler());

  return (
    <View style={styles.container}>
      <Map
        setLocation={setLocation}
        storageHandler={storageHandlerRef.current}
      />
      <ImageSelector
        setImage={setImage}
      />
      <Upload
        imageURI={image}
        location={location}
        storageHandler={storageHandlerRef.current}
      />
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
