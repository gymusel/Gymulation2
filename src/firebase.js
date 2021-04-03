import firebase from "firebase";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcCNoeBEhDQ0rdHtwnf5mwL_QAWJGSt4k",
  authDomain: "gymulation.firebaseapp.com",
  projectId: "gymulation",
  storageBucket: "gymulation.appspot.com",
  messagingSenderId: "766152861827",
  appId: "1:766152861827:web:cf27b8d330dbb5bea953b6",
  measurementId: "G-2J1DTR5J5X"
};

firebase.initializeApp(firebaseConfig);