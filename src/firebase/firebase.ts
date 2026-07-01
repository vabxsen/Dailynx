import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCX6KOAGrDm6JPEy8X_gDHzEqiGr-sJAUg",
  authDomain: "lifeos-92f2c.firebaseapp.com",
  projectId: "lifeos-92f2c",
  storageBucket: "lifeos-92f2c.firebasestorage.app",
  messagingSenderId: "538030884954",
  appId: "1:538030884954:web:a84e4003f4d4a9bc743063",
  measurementId: "G-0WSJ13EWGF",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;