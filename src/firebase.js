import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: process.env.ISSUE_TRACKER_FIREBASE_API,
    authDomain: "news-hour-1d839.firebaseapp.com",
    projectId: "news-hour-1d839",
    storageBucket: "news-hour-1d839.appspot.com",
    messagingSenderId: "554625176547",
    appId: "1:554625176547:web:aceeb01f4e0ec2731406d6",
    measurementId: "G-65SR2MK00C"
  };

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

export default firestore;
