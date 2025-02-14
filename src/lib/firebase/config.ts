// src/lib/firebase/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

let firebaseClient: FirebaseClient | undefined;

const firebaseConfig = {
  apiKey: 'AIzaSyBBFZtmb8ld7qP2pQjBvAvUKdQEVjh1YIg',
  authDomain: 'devcon-32ab9.firebaseapp.com',
  projectId: 'devcon-32ab9',
  storageBucket: 'devcon-32ab9.firebasestorage.app',
  messagingSenderId: '203526678142',
  appId: '1:203526678142:web:915195a8c84aab792f1a2f'
};

// Initialize Firebase only if it is not already initialized
export function initializeFirebase(): FirebaseClient {
  if (firebaseClient) {
    return firebaseClient;
  }

  if (!getApps().length) {
    // Initialize Firebase app
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    firebaseClient = { app, auth, db, storage };
  }

  return firebaseClient!; // Return the already initialized Firebase client
}

// Helper functions to get Firebase instances
export function getFirebaseApp() {
  return initializeFirebase().app;
}

export function getFirebaseAuth() {
  return initializeFirebase().auth;
}

export function getFirebaseDb() {
  return initializeFirebase().db;
}

export function getFirebaseStorage() {
  return initializeFirebase().storage;
}
