import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import ImageSelector from './ImageSelector';

export default function Map() {
  const zoom = 0.08;
  const region = {
    latitude: 60.206520748978086, 
    longitude: 24.976684821198532,
    latitudeDelta: zoom,
    longitudeDelta: zoom,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}>

      </MapView>
     <ImageSelector /> 
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
    width: '100%',
    height: '100%'
  }
});