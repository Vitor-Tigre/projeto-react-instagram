import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC0MxTTGQhB-uZ3pRO2C1RnP34Zt298_AU",
    authDomain: "instagram-clone-5bcf3.firebaseapp.com",
    projectId: "instagram-clone-5bcf3",
    storageBucket: "instagram-clone-5bcf3.appspot.com",
    messagingSenderId: "91968240313",
    appId: "1:91968240313:web:0995571eb96c1862017968",
    measurementId: "G-7W0NYZ86CQ",
});

const db = firebase.firestore();    //database em tempo real
const auth = firebase.auth();   //autenticação
const storage = firebase.storage(); //upload de arquivos
const functions = firebase.functions();

export {db, auth, storage, functions};