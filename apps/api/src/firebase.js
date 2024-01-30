import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyA6eW1qWdmZ42KH6jnJ_4ylDrmHlC9ySm8",
  authDomain: "login-masnstay-fc79f.firebaseapp.com",
  projectId: "login-masnstay-fc79f",
  storageBucket: "login-masnstay-fc79f.appspot.com",
  messagingSenderId: "823219362122",
  appId: "1:823219362122:web:f88aedf45b24bd8c90c9b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const registerWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user
    } catch (error) {
        console.log("Error from firebase auth:", error);
    }
}

