import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
  type User
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { addDocument } from '@/lib/firebase/db';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
}

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const AuthService = {
  async signInWithGoogle(): Promise<AuthUser> {
    const auth = getFirebaseAuth();
    const result = await signInWithPopup(auth, googleProvider);
    return this.handleAuthResult(result, 'google');
  },

  async signInWithFacebook(): Promise<AuthUser> {
    const auth = getFirebaseAuth();
    const result = await signInWithPopup(auth, facebookProvider);
    return this.handleAuthResult(result, 'facebook');
  },

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    const auth = getFirebaseAuth();
    const result = await signInWithEmailAndPassword(auth, email, password);
    return this.handleAuthResult(result, 'password');
  },

  async signUpWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthUser> {
    const auth = getFirebaseAuth();
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await addDocument(
      'users',
      {
        uid: result.user.uid,
        email,
        displayName,
        createdAt: new Date()
      },
      result.user.uid
    );

    return this.handleAuthResult(result, 'password');
  },

  async signOut(): Promise<void> {
    const auth = getFirebaseAuth();
    await signOut(auth);
  },

  getCurrentUser(): User | null {
    const auth = getFirebaseAuth();
    return auth.currentUser;
  },

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const auth = getFirebaseAuth();
    return auth.onAuthStateChanged(callback);
  },

  async handleAuthResult(
    result: UserCredential,
    provider: string
  ): Promise<AuthUser> {
    const { user } = result;

    const authUser: AuthUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider
    };

    await addDocument(
      'users',
      {
        ...authUser,
        lastLogin: new Date()
      },
      user.uid
    );

    return authUser;
  }
};
