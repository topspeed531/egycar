import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGkC6uVZlVVFPGaiBM0ubFWSDIEfuwkF0",
  authDomain: "egycar-app.firebaseapp.com",
  projectId: "egycar-app",
  storageBucket: "egycar-app.firebasestorage.app",
  messagingSenderId: "366779738419",
  appId: "1:366779738419:web:189f5e629481b67fcb7646",
  measurementId: "G-5Q9JHSC7VH"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();