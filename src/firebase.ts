import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFIEgDaviWTBFE_JN2NdI_2V6JEUvPWzA",
  authDomain: "todolist-new-1e329.firebaseapp.com",
  projectId: "todolist-new-1e329",
  storageBucket: "todolist-new-1e329.firebasestorage.app",
  messagingSenderId: "480035681465",
  appId: "1:480035681465:web:4b6b23569b464f04229768",
  measurementId: "G-FYBPZZK9Z4",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);