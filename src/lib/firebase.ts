import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMqdF9qWhHQjRZ83bcv45YZZKZjXIg7fw",
  authDomain: "pivotacorp.firebaseapp.com",
  projectId: "pivotacorp",
  storageBucket: "pivotacorp.firebasestorage.app",
  messagingSenderId: "718308464901",
  appId: "1:718308464901:web:424bb44b172e91df11ff6c",
  measurementId: "G-X2YNLVKY91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);