// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "joyboy-estate.firebaseapp.com",
  projectId: "joyboy-estate",
  storageBucket: "joyboy-estate.appspot.com",
  messagingSenderId: "993492494287",
  appId: "1:993492494287:web:ba01abd8ce102702f654ba"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);