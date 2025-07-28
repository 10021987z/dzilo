// Configuration Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBqJVVLtgsqOSzgjQzOqZnVVVVVVVVVVVV",
  authDomain: "dziljo-demo-project.firebaseapp.com",
  projectId: "dziljo-demo-project",
  storageBucket: "dziljo-demo-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// For development - connect to emulators
if (process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Emulators already connected');
  }
}

export default app;