const firebase = require('firebase');
const admin = require('firebase-admin');
var serviceAccount = require('../../../utils/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://funfunretro.firebaseio.com',
});

firebase.initializeApp({
  apiKey: 'AIzaSyD_oGtyzOu_e-Pgm8s9yZjDYetW5ab5BP4',
  authDomain: 'funfunretro.firebaseapp.com',
  databaseURL: 'https://funfunretro.firebaseio.com',
  projectId: 'funfunretro',
  storageBucket: 'funfunretro.appspot.com',
  messagingSenderId: '944978282083',
  appId: '1:944978282083:web:700b549d11145448b15a56',
  measurementId: 'G-TJ96WJFW5G',
});

const db = admin.firestore();

module.exports = { firebase, db, admin };
