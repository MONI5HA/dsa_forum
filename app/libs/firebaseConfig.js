// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAV64ulz9kSXXyyOg9Udtk1iiErLuUFL-M",
  authDomain: "coding-d6a47.firebaseapp.com",
  databaseURL: "https://coding-d6a47-default-rtdb.firebaseio.com",
  projectId: "coding-d6a47",
  storageBucket: "coding-d6a47.firebasestorage.app",
  messagingSenderId: "498755729820",
  appId: "1:498755729820:web:3b525c270797e9444cf059",
  measurementId: "G-2DSYDTESHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)

export default app;