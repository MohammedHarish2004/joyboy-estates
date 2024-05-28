// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-152c2.firebaseapp.com",
  projectId: "mern-estate-152c2",
  storageBucket: "mern-estate-152c2.appspot.com",
  messagingSenderId: "1004875833568",
  appId: "1:1004875833568:web:a0b12af382fbb4a48bb085"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);