'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { initializeFirebase, getFirebaseAuth } from '@/lib/firebase/config';
import { AuthService } from '@/services/AuthService';
import { User as UserProfile } from '@/types/types';
type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeFirebase();
    const auth = getFirebaseAuth();

    // Check if user is already authenticated (on page load)
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchUserProfile(currentUser); // Fetch profile if the user is authenticated
    }

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        // await fetchUserProfile(user);
      } else {
        setUserProfile(null); // Clear profile when user logs out
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (user: User) => {
    try {
      const authService = AuthService;
      const profile = await authService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
