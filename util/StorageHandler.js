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
    this.firestore = getFirestore(app);
    this.imageCollection = collection(this.firestore, 'images');
  }

  uploadImage = async (uri, location) => {
    const { latitude, longitude } = location;
    const hash = geofire.geohashForLocation([latitude, longitude]);
    const response = await fetch(uri);
    const imageBlob = await response.blob();
    const uuid = create_UUID();
    const storageRef = getStorageRef(this.storage, uuid);

    await uploadBytes(storageRef, imageBlob);
    const url = await getDownloadURL(storageRef);
    await addDoc(this.imageCollection, {
      data: url,
      hash: hash,
      lat: latitude,
      lng: longitude
    });
  }

  getImages = async (location) => {
    const center = [location.latitude, location.longitude];
    const radius = 10000; // In metres

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
    const images = [];
    for (const q of queries) {
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        const imageDoc = doc.data();
        const { lat, lng } = imageDoc;
        
        const distanceToCenter = geofire.distanceBetween([lat, lng], center) * 1000;
        if (distanceToCenter <= radius) {
          images.push({ doc: imageDoc, id: doc.id });
        }
      })
    }
    return images;
  }
}

const create_UUID = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}