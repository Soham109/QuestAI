import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMnjZe6TQK3quOsaGiTsYJv2KuS6OKTlI",
  authDomain: "questai-a4eb6.firebaseapp.com",
  projectId: "questai-a4eb6",
  storageBucket: "questai-a4eb6.appspot.com",
  messagingSenderId: "704048384906",
  appId: "1:704048384906:web:4d168726365f8b5376d673",
  measurementId: "G-NZ8M287L8W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
