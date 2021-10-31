import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCP852j1rNKvt4CVR8UpvivYdKxr7aV_9k",
  authDomain: "local-image-share.firebaseapp.com",
  projectId: "local-image-share",
  storageBucket: "local-image-share.appspot.com",
  messagingSenderId: "103117150883",
  appId: "1:103117150883:web:7533f4365a35d7f0e4bd16",
  measurementId: "G-BSDXEC03JB"
};

const app = initializeApp(firebaseConfig);

export { app };
