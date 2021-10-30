import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Dimensions, View } from 'react-native';
import { Icon } from 'react-native-elements';

export const ImageViewer = ({ image, closeImage }) => {
  const [current, setCurrent] = useState(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const { width } = Dimensions.get('window');
    // Set image size to 4:3 aspect
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
      <Icon
        name='close'
        reverse
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