import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBd2zdRk3onp61kNCDk2YkJQ44WYe4z-A",
  authDomain: "halo-app-f073e.firebaseapp.com",
  projectId: "halo-app-f073e",
  storageBucket: "halo-app-f073e.firebasestorage.app",
  messagingSenderId: "952780221524",
  appId: "1:952780221524:web:67a9546a1a7ac22be991c1",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
