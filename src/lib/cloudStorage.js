// Firestore persistence — same shape as the old window.storage-based save/load,
// just backed by a real database keyed on the signed-in user's uid.

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const stateDocRef = (uid) => doc(db, "users", uid, "appState", "main");

export async function loadState(uid) {
  const snap = await getDoc(stateDocRef(uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveState(uid, state) {
  await setDoc(stateDocRef(uid), state, { merge: true });
}
