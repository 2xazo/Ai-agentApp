// src/config/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCoKoeLiuPJKPhrLIswHg0q8vhcpwAozFo",
  authDomain: "ai-agentapp.firebaseapp.com",
  projectId: "ai-agentapp",
  storageBucket: "ai-agentapp.appspot.com",
  messagingSenderId: "736830321903",
  appId: "1:736830321903:web:b5fe17d4bddeb0dc11971a"
};

// Initialize Firebase
let app;
let auth;

try {
  // Initialize Firebase only if it hasn't been initialized already
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);

  // Debug logs
  console.log('Firebase Apps:', getApps());
  console.log('Current Firebase App:', app);
  console.log('Auth Instance:', auth);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth };
export default app;