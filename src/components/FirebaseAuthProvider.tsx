"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider, 
  setPersistence,
  browserLocalPersistence,
  type User, 
  type Auth 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    
    getRedirectResult(authInstance).catch((error) => {
      console.error("Error processing redirect result", error);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    if (auth) {
      try {
        // Explicitly set persistence to be more robust across redirects.
        await setPersistence(auth, browserLocalPersistence);
        const provider = new GoogleAuthProvider();
        // Always use the redirect method.
        await signInWithRedirect(auth, provider);
      } catch (error) {
        console.error("Error signing in with Google: ", error);
      }
    }
  };

  const signOut = async () => {
    if (auth) {
      try {
        await auth.signOut();
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    }
  };

  const value = { user, loading, signIn, signOut };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}
