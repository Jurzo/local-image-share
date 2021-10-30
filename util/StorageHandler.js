import { initializeApp } from 'firebase/app';
import { getStorage, ref as getStorageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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

    uploadImage = async (uri, name, location) => {
        const { lat, lng } = location;
        const hash = geofire.geohashForLocation([lat, lng]);
        const response = await fetch(uri);
        const imageBlob = await response.blob();
        const storageRef = getStorageRef(this.storage, name);
        
        await uploadBytes(storageRef, imageBlob);
        const url = await getDownloadURL(storageRef);
        await addDoc(this.imageCollection, {
            data: url,
            hash: hash,
            lat: lat,
            lng: lng
        });
    }
}