import * as firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyCEpkIFQQn_vwtz4qoUgkycWW6HECGbWNs",
    authDomain: "roommates-6040d.firebaseapp.com",
    projectId: "roommates-6040d",
    storageBucket: "roommates-6040d.appspot.com",
    messagingSenderId: "601507315210",
    appId: "1:601507315210:web:8ea504990786e9003569f3",
    measurementId: "G-YY94RXM3EM"
  };
  let app;
  if (firebase.apps.length === 0) {
      app = firebase.initializeApp(firebaseConfig)
  } else {
      app = firebase.app()
  }
  const auth = firebase.auth()
  const db = firebase.firestore();
  const storage = firebase.storage();
 export default auth
 export {db,storage}