import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ImageSelector from './components/ImageSelector';
import { ImageViewer } from './components/ImageViewer';
import Map from './components/Map';
import Upload from './components/Upload';
import { StorageHandler } from './util/StorageHandler';

export default function App() {
  const [usersImage, setUsersImage] = useState(null);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({
    latitude: undefined,
    longitude: undefined
  });
  const storageHandlerRef = useRef(new StorageHandler());

  const closeImage = () => {
    setImage(null);
  }

  return (
    <View style={styles.container}>
      <Map
        setLocation={setLocation}
        storageHandler={storageHandlerRef.current}
        setImage={setImage}
      />
      {usersImage ?
        <Upload
          imageURI={usersImage}
          setImage={setUsersImage}
          location={location}
          storageHandler={storageHandlerRef.current}
        />
        :
        <ImageSelector
          setImage={setUsersImage}
        />}
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
