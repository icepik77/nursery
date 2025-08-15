// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABlHhUCAsmVZ-lWHUb7X7KBveQ1dADIGU",
  authDomain: "nursery-50a36.firebaseapp.com",
  projectId: "nursery-50a36",
  storageBucket: "nursery-50a36.firebasestorage.app",
  messagingSenderId: "390387441316",
  appId: "1:390387441316:web:bb20b35c20899d58fe1031",
  measurementId: "G-LELHZTCLL5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});
export const storage = getStorage(app);