import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function Upload({
  imageURI,
  location,
  storageHandler
}) {

  const store = () => {
    storageHandler.uploadImage(imageURI, location);
  }

  return (
    <View style={styles.uploadContainer}>
      <Button
        raised
        title='Upload'
        onPress={store}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  uploadContainer: {
    position: 'absolute',
    top: 50,
    right: 50
  },
});