import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJUaYL5HtXy7BwEoGhJwFeCV2ag-OkAeU",
  authDomain: "proyecto-chesa.firebaseapp.com",
  projectId: "proyecto-chesa",
  storageBucket: "proyecto-chesa.firebasestorage.app",
  messagingSenderId: "462706116532",
  appId: "1:462706116532:web:da0d54dba6fa5f540f94e1",
  measurementId: "G-91BWBH0396"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
