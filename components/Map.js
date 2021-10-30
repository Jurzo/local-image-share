import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map({ setLocation, storageHandler }) {
  const zoom = 0.04;
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: zoom,
    longitudeDelta: zoom,
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    const interval = setInterval(updateMap, 10000);

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('App requires location permission to work');
        return;
      }
    })();

    return (() => clearInterval(interval));
  }, []);

  const updateMap = async () => {
    getLocation();
    const nearby = await storageHandler.getImages({
      latitude: region.latitude,
      longitude: region.longitude
    });
    setImages(nearby);
  }

  const getLocation = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const location = await Location.getLastKnownPositionAsync({
      accuracy: 6,
    });
    setRegion({
      ...region,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    })
  }

  return (
    <MapView
      style={styles.map}
      region={region}
      pitchEnabled={false}
      rotateEnabled={false}
      zoomEnabled={true}
      scrollEnabled={false}
    >
      {/* <Marker
        coordinate={{
          latitude: region.latitude,
          longitude: region.longitude
        }}
      /> */}
      {images.map(image => {
        return (
          <Marker
            key={image.id}
            coordinate={{
              latitude: image.doc.lat,
              longitude: image.doc.lng
            }}
            onSelect={() => console.log(image.doc.data)}
            onPress={() => console.log(image.doc.data)}
          >
            <Image
              style={styles.marker}
              source={{uri: image.doc.data}}
            />
          </Marker>
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  },
  marker: {
    width: 35,
    height: 35,
    backgroundColor: '#000000',
    borderRadius: 35,
  }
});