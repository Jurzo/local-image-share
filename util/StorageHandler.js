import { initializeApp } from 'firebase/app';
import { getStorage, ref as getStorageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, startAt, endAt } from 'firebase/firestore';
import * as geofire from 'geofire-common';

const firebaseConfig = {
  apiKey: "AIzaSyCP852j1rNKvt4CVR8UpvivYdKxr7aV_9k",
  authDomain: "local-image-share.firebaseapp.com",
  projectId: "local-image-share",
  storageBucket: "local-image-share.appspot.com",
  messagingSenderId: "103117150883",
  appId: "1:103117150883:web:7533f4365a35d7f0e4bd16",
  measurementId: "G-BSDXEC03JB"
};

export class StorageHandler {
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.storage = getStorage(app);
    const firestore = getFirestore(app);
    this.imageCollection = collection(firestore, 'images');
  }

  uploadImage = async (uri, location, callback) => {
    // Create location hash for queries
    const { latitude, longitude } = location;
    const hash = geofire.geohashForLocation([latitude, longitude]);

    const response = await fetch(uri);
    const imageBlob = await response.blob();
    // Generate uuid to get unique name for every image uploaded
    const uuid = create_UUID();

    // Upload image to firebase storage
    const storageRef = getStorageRef(this.storage, uuid);
    await uploadBytes(storageRef, imageBlob);
    const url = await getDownloadURL(storageRef);
    // Set reference to stored image in database
    await addDoc(this.imageCollection, {
      data: url,
      hash: hash,
      lat: latitude,
      lng: longitude
    });
    callback(location);
  }

  getImages = async (location) => {
    const center = [location.latitude, location.longitude];
    const radius = 1000; // In metres

    // Generate queries based on location and radius
    const bounds = geofire.geohashQueryBounds(center, radius);
    const queries = [];
    for (const b of bounds) {
      queries.push(query(
        this.imageCollection,
        orderBy('hash'),
        startAt(b[0]),
        endAt(b[1])
      ));
    }
    // Get documents from queries and do
    // a finer check with lat and lng
    const images = [];
    for (const q of queries) {
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        const imageDoc = doc.data();
        const { lat, lng } = imageDoc;
        
        // distance in metres
        const distanceToCenter = geofire.distanceBetween([lat, lng], center) * 1000;
        if (distanceToCenter <= radius) {
          images.push({ doc: imageDoc, id: doc.id });
        }
      })
    }
    return images;
  }
}

// from https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
const create_UUID = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}