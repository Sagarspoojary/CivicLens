import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Default/Placeholder configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Helper to check if real credentials are provided
const isRealConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

let app;
let auth = null;
let db = null;
let storage = null;

if (isRealConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("CivicLens Admin: Connected to actual Firebase services.");
  } catch (error) {
    console.warn("CivicLens Admin: Firebase initialization error, running in simulated mode.", error);
  }
} else {
  console.log("-----------------------------------------------------------------");
  console.log("CivicLens Admin WARNING: Running in high-fidelity simulated mode.");
  console.log("Preconfigured login accounts will work immediately inside the UI.");
  console.log("To connect to a live Firebase server, define VITE_FIREBASE_API_KEY in .env");
  console.log("-----------------------------------------------------------------");
}

export { auth, db, storage, isRealConfig };
export default app;
