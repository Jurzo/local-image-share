import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import SnackBar from 'react-native-snackbar-component';

export default function Uploader({
  callback,
  imageURI,
  location,
  storageHandler,
  setImage
}) {
  const [loc, setLoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [failed, setFailed] = useState(false);

  const store = async (imageLocation) => {
    setUploading(true);
    const result = await storageHandler.uploadImage(imageURI, imageLocation, callback);
    setUploading(false);
    if (result) {
      setImage(null);
    } else {
      setFailed(true);
    }
  }

  useEffect(() => {
    setLoc(location);
  }, [location]);

  return (
    <View style={styles.container}>
      <View style={styles.snack}>
        <SnackBar
          visible={uploading}
          textMessage='Uploading...'
        />
        <SnackBar
          visible={failed}
          textMessage='Uploading failed'
          actionHandler={() => setFailed(false)}
          actionText='ok'
        />
      </View>
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
          onPress={() => store(loc)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    padding: 5,
    bottom: 0,
    width: '100%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: 'rgba(0.1,0.1,0.1,0.5)',
  },
  infoText: {
    color: 'white'
  },
  snack: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});