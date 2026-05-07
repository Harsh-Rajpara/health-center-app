import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./config";

const db = getFirestore();

export const setAdminRole = async (email) => {
  try {
    const user = auth.currentUser;
    if (user && user.email === REACT_APP_ADMIN_EMAIL) {
      const adminRef = doc(db, "admins", user.uid);
      await setDoc(adminRef, {
        email: user.email,
        role: "admin",
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });
      console.log("Admin role set successfully");
    }
  } catch (error) {
    console.error("Error setting admin role:", error);
  }
};

export const isUserAdmin = async (uid) => {
  try {
    const adminRef = doc(db, "admins", uid);
    const adminDoc = await getDoc(adminRef);
    return adminDoc.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};