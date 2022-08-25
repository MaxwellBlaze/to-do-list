import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDLsV5HIozqN23FvRvXfLqcRIynwM5VB4o",
    authDomain: "todolist-eabcf.firebaseapp.com",
    projectId: "todolist-eabcf",
    storageBucket: "todolist-eabcf.appspot.com",
    messagingSenderId: "67521169842",
    appId: "1:67521169842:web:a3e154936f5244a7b73cab"
};

// Initialize Firebase
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
