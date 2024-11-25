// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhPCv1eyzCcrcB-X-WPfzzdhuW0YxvfrI",
  authDomain: "questboard-76060.firebaseapp.com",
  projectId: "questboard-76060",
  storageBucket: "questboard-76060.firebasestorage.app",
  messagingSenderId: "103169205388",
  appId: "1:103169205388:web:35c3241a877f956b9d87a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth}