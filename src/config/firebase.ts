// Configuration Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3PfCi-MEFofCshsJQS-hMGDcXSHZnlA8",
  authDomain: "dzijo-d6fa4.firebaseapp.com",
  projectId: "dzijo-d6fa4",
  storageBucket: "dzijo-d6fa4.firebasestorage.app",
  messagingSenderId: "602787753667",
  appId: "1:602787753667:web:137e942ca008e0105e7c76",
  measurementId: "G-HC6C2ET3FS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// For development - connect to emulators (commented out for production)
// if (process.env.NODE_ENV === 'development') {
//   try {
//     connectAuthEmulator(auth, 'http://localhost:9099');
//     connectFirestoreEmulator(db, 'localhost', 8080);
//   } catch (error) {
//     console.log('Emulators already connected');
//   }
// }

export default app;