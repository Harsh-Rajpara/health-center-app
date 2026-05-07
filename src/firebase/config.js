// src/firebase/config.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Admin email
const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if this is admin
    const isAdmin = user.email === ADMIN_EMAIL;

    // Check if user already exists
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    let userData;

    if (!userDoc.exists()) {
      userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        isAdmin: isAdmin,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        appointmentCount: 0,
        status: "active",
      };
      await setDoc(userRef, userData);
      console.log("New user created with createdAt:", userData.createdAt);
    } else {
      const existingData = userDoc.data();
      userData = {
        ...existingData,
        lastLogin: new Date().toISOString(), 
      };
      await setDoc(userRef, userData, { merge: true });
    }

    return { success: true, user: userData, isAdmin: isAdmin };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: error.message };
  }
};
// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout Error:", error);
    return { success: false, error: error.message };
  }
};

export const getAllDoctors = async () => {
  const snapshot = await getDocs(collection(db, "doctors"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            resolve(userDoc.data());
          } else {
            // If user doesn't exist in Firestore, create it
            const userData = {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            };
            await setDoc(userRef, userData);
            resolve(userData);
          }
        } catch (error) {
          console.error("Error getting user:", error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

export const getAllNews = async () => {
  try {
    const snapshot = await getDocs(collection(db, "news"));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};
export const storage = getStorage(app);
