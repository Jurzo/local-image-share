import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, StyleSheet, Dimensions, View } from 'react-native';

export const ImageViewer = ({ image, closeImage }) => {
  const [current, setCurrent] = useState(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    setSize({
      width: width,
      height: Math.floor(width * (3/4))
    })
    setCurrent(image);
  }, [image]);

  return (
    <View style={styles.imageContainer}>
      <Image
        style={{
          ...styles.image,
          ...size
        }}
        source={{ uri: current }}
      />
      <Button
        title='close'
        onPress={closeImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    
  },
  image: {
    resizeMode: 'cover',
    opacity: 1
  }
});