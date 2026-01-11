import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const signInAdmin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutAdmin = () => {
  return signOut(auth);
};

// Returns a promise that resolves with the User object or null
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

/**
 * Checks if the user is in the 'admins' collection.
 * @param {string} uid 
 * @returns {Promise<boolean>}
 */
export const isAdmin = async (uid) => {
  if (!uid) return false;
  try {
    const docRef = doc(db, "admins", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
