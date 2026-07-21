import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

// Tracks the signed-in user and exposes email/password sign-in, sign-up,
// guest (anonymous) sign-in, and sign-out. Does NOT auto sign-in anonymously
// anymore — the app shows a login/sign-up screen until the person picks one.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  async function signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(email, password) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function signInGuest() {
    await signInAnonymously(auth);
  }

  async function signOutUser() {
    await signOut(auth);
  }

  return { user, authChecked, signIn, signUp, signInGuest, signOutUser };
}
