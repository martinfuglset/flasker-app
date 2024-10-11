// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjFQ96PMVp4Rd724dZZMUouHWRY19zXdY",
  authDomain: "flasker-b0689.firebaseapp.com",
  projectId: "flasker-b0689",
  storageBucket: "flasker-b0689.appspot.com",
  messagingSenderId: "890278297450",
  appId: "1:890278297450:web:e896df00669f308095af13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it for use in other files
const db = getFirestore(app);

export { db };
