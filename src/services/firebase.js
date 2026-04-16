import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0PSc39DME7z80FxoyNRT-T-RZJEF1RfI",
  authDomain: "habit-rpg-blazi-dev.firebaseapp.com",
  projectId: "habit-rpg-blazi-dev",
  storageBucket: "habit-rpg-blazi-dev.firebasestorage.app",
  messagingSenderId: "813647594253",
  appId: "1:813647594253:web:f55e1b41744b1a2f0c2644"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const functions = getFunctions(app);
export const auth = getAuth(app);
