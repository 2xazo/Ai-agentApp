// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  getAuth
} from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    let unsubscribe;
    
    const initializeAuth = async () => {
      try {
        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence);
        console.log('Persistence set to LOCAL');

        // Set up auth state listener
        unsubscribe = onAuthStateChanged(auth, 
          (user) => {
            console.log('Auth state changed:', user ? 'User logged in' : 'No user');
            setCurrentUser(user);
            setLoading(false);
          }, 
          (error) => {
            console.error('Auth state change error:', error);
            setError(error);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError(error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup: async (email, password) => {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
        return result;
      } catch (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        throw error;
      }
    },
    login: async (email, password) => {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully!');
        return result;
      } catch (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        throw error;
      }
    },
    loginWithGoogle: async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        toast.success('Logged in with Google successfully!');
        return result;
      } catch (error) {
        console.error('Google login error:', error);
        toast.error(error.message);
        throw error;
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
        setCurrentUser(null);
        toast.success('Logged out successfully!');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error(error.message);
        throw error;
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error Initializing App</h2>
          <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}