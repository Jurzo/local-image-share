## Local Image Share
This is a school course project of a React Native app that allows users to upload images to their current location and to see uploaded images near them.

## Technologies used
- Firebase
    - Firebase storage for storing user uploaded images
    - Firebase firestore for keeping a database of image URLs and locations
- Geofire
    - Creating hashes from latitude and longitude for image querying
- Expo-location
    - Getting user location
- Expo-image-picker
    - Allowing user to either take a picture or choose one from gallery
- React-native-maps
    - Map rendering of surrounding area with images from database