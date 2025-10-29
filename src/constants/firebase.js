// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: "baitfusion-39d24",
    storageBucket: "baitfusion-39d24.firebasestorage.app",
    messagingSenderId: "620311963057",
    appId: "1:620311963057:web:9659c73e77f0a39b638990",
    measurementId: "G-591SN7DZ62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default {
    auth, db
}