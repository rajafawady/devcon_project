import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { addDocument, getDocument } from '@/lib/firebase/db';
import { User } from '@/types/types';
import { ContestantService } from './Services';

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
    displayName: string,
    role = 'contestant' as any
  ): Promise<User> {
    const auth = getFirebaseAuth();

    // Create user in Firebase Authentication
    const result: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update the Firebase user's display name
    await updateProfile(result.user, { displayName });

    // Prepare user data
    const userData: User = {
      id: result.user.uid,
      email,
      displayName,
      photoURL: result.user.photoURL || '',
      role,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    // Save user data to Firestore
    await addDocument('users', userData, result.user.uid);

    if (role === 'contestant') {
      await ContestantService.register({
        userId: result.user.uid,
        name: displayName,
        email,
        songPreferences: [],
        profile: {}
      });
    }

    return userData;
  },

  async signOut(): Promise<void> {
    const auth = getFirebaseAuth();
    await signOut(auth);
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
  },
  async getUserProfile(uid: string): Promise<User | null> {
    const userDoc = (await getDocument('users', uid)) as User;
    if (!userDoc) return null;

    return {
      id: userDoc.id,
      email: userDoc.email,
      displayName: userDoc.displayName,
      photoURL: userDoc.photoURL || '',
      role: userDoc.role,
      createdAt: userDoc.createdAt,
      lastLogin: userDoc.lastLogin
    } as User;
  }
};
