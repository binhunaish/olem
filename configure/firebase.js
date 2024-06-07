// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARANXIAn6hZFRlsi3oQpjmpPeVidusM3o",
  authDomain: "olem-2558f.firebaseapp.com",
  projectId: "olem-2558f",
  storageBucket: "olem-2558f.appspot.com",
  messagingSenderId: "589876279974",
  appId: "1:589876279974:web:ddb5b586268cf89cf05267",
  measurementId: "G-PKP5VHEM3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);