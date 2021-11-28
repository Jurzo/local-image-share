import React, { useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Menu from './Menu';

export default function Map({ storageHandler, setViewImage }) {
  const region = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  const [location, setLocation] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
  });
  const [images, setImages] = useState([]);
  const mapRef = useRef();

  const init = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('App requires location permission to work');
      return;
    }

    // Watch for position changes to get images
    // and update map position accordingly
    Location.watchPositionAsync({
      accuracy: 4,
      distanceInterval: 100,
    }, update);
  }

  const update = async (location) => {
    updateLocation(location.coords);
    await getImages(location.coords);
  }

  const getImages = async ({ latitude, longitude }) => {
    const nearbyImages = await storageHandler.getImages({
      latitude: latitude,
      longitude: longitude
    });
    setImages(nearbyImages);
  }

  const updateLocation = ({ latitude, longitude }) => {
    animateToLocation(latitude, longitude);
    setLocation({
      latitude: latitude,
      longitude: longitude
    });

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

  const animateToLocation = (latitude, longitude) => {
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
    <View style={styles.container}>
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
        onMapReady={init}
      >
        {images.map(image => {
          return (
            <Marker
              key={image.id}
              coordinate={{
                latitude: image.doc.lat,
                longitude: image.doc.lng
              }}
              onSelect={() => setViewImage(image.doc.data)}
              onPress={() => setViewImage(image.doc.data)}
            >
              <Image
                style={styles.marker}
                source={{ uri: image.doc.data }}
              />
            </Marker>
          );
        })}
      </MapView>
      <Menu
        location={location}
        storageHandler={storageHandler}
        updateCallback={getImages}
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
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    width: 35,
    height: 35,
    backgroundColor: '#000000',
    borderRadius: 35,
  }
});