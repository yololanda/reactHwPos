import firebase  from 'firebase/compat/app';
import 'firebase/compat/database'
import 'firebase/compat/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCdXIbFToaKUZ8gDufvq9Iw1BmIeLdBhNw",
    authDomain: "reactnativefirebase-fe328.firebaseapp.com",
    databaseURL: "https://reactnativefirebase-fe328-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "reactnativefirebase-fe328",
    storageBucket: "reactnativefirebase-fe328.appspot.com",
    messagingSenderId: "98060948560",
    appId: "1:98060948560:web:2190fcf70cd25970dd6d55"
  };
  let app = firebase.initializeApp(firebaseConfig);
  const authFirebase = app.auth()
  
  const db = app.database()

  export { db, authFirebase }