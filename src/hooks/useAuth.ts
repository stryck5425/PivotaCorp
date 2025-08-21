import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (username: string, password: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUsername(userDocSnap.data().username);
        } else {
          setUsername(null); // Should not happen if user is created correctly
        }
      } else {
        setUsername(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const usernameToEmail = (username: string) => `${username.toLowerCase()}@monapp.local`;

  const signUp = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Check if username already exists
      const usernamesRef = collection(db, 'usernames');
      const q = query(usernamesRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("Username already taken. Please choose a different one.");
        setLoading(false);
        return;
      }

      const email = usernameToEmail(username);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Store username in Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        username: username.toLowerCase(),
        personalRecordTimeSpent: 0,
        createdAt: new Date(),
      });
      await setDoc(doc(db, 'usernames', username.toLowerCase()), {
        uid: newUser.uid,
      });

      setUser(newUser);
      setUsername(username.toLowerCase());
      toast.success(`Welcome, ${username}! Your account has been created.`);
    } catch (error: any) {
      console.error("Error signing up:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email (username) is already in use. Try logging in or using a different username.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password is too weak. Please use at least 6 characters.");
      } else {
        toast.error(`Failed to sign up: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      const email = usernameToEmail(username);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success(`Welcome back, ${username}!`);
    } catch (error: any) {
      console.error("Error signing in:", error);
      if (error.code === 'auth/invalid-credential') {
        toast.error("Invalid username or password.");
      } else {
        toast.error(`Failed to sign in: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      toast.info("You have been logged out.");
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast.error(`Failed to log out: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};