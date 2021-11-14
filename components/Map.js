import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map({ setLocation, storageHandler, setImage }) {
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [images, setImages] = useState([]);
  const mapRef = useRef();

  useEffect(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('App requires location permission to work');
      return;
    }

    await update();
    const interval = setInterval(update, 5000);

    return (() => {
      clearInterval(interval);
    });
  }, []);

  const update = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const location = await Location.getCurrentPositionAsync({ accuracy: 4 });
    await updateLocation(location.coords);
    await updateMap(location.coords);
  }

  const updateMap = async ({ latitude, longitude }) => {
    const nearbyImages = await storageHandler.getImages({
      latitude: latitude,
      longitude: longitude
    });
    setImages(nearbyImages);
  }

  const updateLocation = (coords) => {
    const { latitude, longitude } = coords;
    setRegion({
      ...region,
      latitude: latitude,
      longitude: longitude,
    });
    // set location data for uploading images
    setLocation({
      latitude: latitude,
      longitude: longitude,
    });
    animateToLocation(coords);
    // restricting panning on map to nearby locations
    if (mapRef.current) {
      mapRef.current.setMapBoundaries(
        {
          latitude: latitude + 0.005,
          longitude: longitude + 0.01
        },
        {
          latitude: latitude - 0.005,
          longitude: longitude - 0.01
        }
      )
    }
  }

  const animateToLocation = ({ latitude, longitude }) => {
    if (mapRef.current) {
      const newCamera = {
        center: {
          latitude: latitude,
          longitude: longitude
        }
      };
      mapRef.current.animateCamera(newCamera, { duration: 1 });
    }
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      scrollEnabled={true}
      rotateEnabled={false}
      zoomEnabled={true}
      toolbarEnabled={false}
      showsUserLocation={true}
      showsMyLocationButton={false}
      minZoomLevel={15}
      maxZoomLevel={18}
      ref={mapRef}
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