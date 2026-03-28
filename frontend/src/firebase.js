import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBJMY-cCWHV8_USIkdXMyOX2r9dJwBaZQ",
  authDomain: "student-expense-tracker-dcit.firebaseapp.com",
  projectId: "student-expense-tracker-dcit",
  storageBucket: "student-expense-tracker-dcit.firebasestorage.app",
  messagingSenderId: "1050631997323",
  appId: "1:1050631997323:web:434c7f0a77c58c5cc7d18e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
