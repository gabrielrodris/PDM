import { initializeApp } from "firebase/app";
// use getAuth para evitar problemas com persistência nativa em Expo Go
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ7ncDXrenbL__sIT6V2v3MsCokmmuw9Q",
  authDomain: "meuappfirebase-94b4f.firebaseapp.com",
  projectId: "meuappfirebase-94b4f",
  storageBucket: "meuappfirebase-94b4f.firebasestorage.app",
  messagingSenderId: "480733413281",
  appId: "1:480733413281:web:fa392b5d625ea9788095e0",
};

const app = initializeApp(firebaseConfig);

// Usa getAuth (comportamento padrão do SDK web) para evitar auth/configuration-not-found
export const auth = getAuth(app);

export const db = getFirestore(app);
