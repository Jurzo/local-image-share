import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';

export default function Uploader({
  callback,
  imageURI,
  location,
  storageHandler,
  setImage
}) {

  const store = () => {
    storageHandler.uploadImage(imageURI, location, callback);
    setImage(null);
  }

  return (
    <View style={styles.buttonContainer}>
      <Text
        style={styles.infoText}
        h4
      >
        Save
      </Text>
      <Icon
        name='save'
        reverse
        onPress={store}
      />
      <Icon
        name='close'
        reverse
        onPress={() => setImage(null)}
      />
      <Text
        style={styles.infoText}
        h4
      >
        Return
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    padding: 5,
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: 'rgba(0.1,0.1,0.1,0.5)',
  },
  infoText: {
    color: 'white'
  }
});