// const admin = require('firebase-admin');

// // Initialize the SDK
// const serviceAccount = require('/path/to/serviceAccountKey.json'); // Replace with the path to your private key file
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://your-project-id.firebaseio.com' // Replace with your Firebase project's database URL
// });

// // Now you can use the Firebase Admin SDK APIs

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKfq1XAnNjPiQjO7c9ktd7xQGulxVROBM",
  authDomain: "yet-9dab1.firebaseapp.com",
  projectId: "yet-9dab1",
  storageBucket: "yet-9dab1.appspot.com",
  messagingSenderId: "210797092635",
  appId: "1:210797092635:web:13f96f1df0ab4b577ffdbe",
  measurementId: "G-TQ06EQ6K62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);