import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map({ setLocation, storageHandler, setImage }) {
  const zoom = 0.04;
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: zoom,
    longitudeDelta: zoom,
  });
  const [images, setImages] = useState([]);

  useEffect(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('App requires location permission to work');
      return;
    }

    // Update map when 50 metres from last location
    const subscription = await Location.watchPositionAsync({ accuracy: 4, distanceInterval: 50 }, (location) => {
      updateMap(location);
      updateLocation(location);
    });

    return (() => {
      subscription.remove();
    });
  }, []);

  const updateMap = async (location) => {
    const nearbyImages = await storageHandler.getImages({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
    setImages(nearbyImages);
  }

  const updateLocation = (location) => {
    setRegion({
      ...region,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    // set location data for uploading images
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
      zoomEnabled={false}
      scrollEnabled={false}
      toolbarEnabled={false}
    >
      {images.map(image => {
        return (
          <Marker
            key={image.id}
            coordinate={{
              latitude: image.doc.lat,
              longitude: image.doc.lng
            }}
            onSelect={() => setImage(image.doc.data)}
            onPress={() => setImage(image.doc.data)}
          >
            <Image
              style={styles.marker}
              source={{ uri: image.doc.data }}
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