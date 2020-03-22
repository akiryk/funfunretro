// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://funfunretro.firebaseio.com',
});

// From https://firebase.google.com/docs/functions/get-started
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = req.query.text;
//   // Push the new message into the Realtime Database using the Firebase Admin SDK.
//   const dataSnapshot = await admin
//     .database()
//     .ref('/messages')
//     .push({ original: original });
//   // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//   res.redirect(303, dataSnapshot.ref.toString());
// });

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('Yes, hello to the entire world!');
});

//us-central1-funfunretro.cloudfunctions.net/getBoards
exports.getBoards = functions.https.onRequest(async (request, response) => {
  try {
    const boards = await admin
      .firestore()
      .collection('boards')
      .get();
    console.log(typeof boards);
    console.log(Array.isArray(data));
    console.log('boards', boards);
    // const boardNames = boards.map(board => board.data()).join(', ');
    return response.json(boards);
  } catch (err) {
    console.log(err);
    console.log(err.message);
  }
});

exports.getUserBoards = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection('boards')
    .get()
    .then(data => {
      let users = [];
      data.forEach(doc => {
        users.push(doc.data());
      });
      return res.json(users);
    })
    .catch(err => {
      console.log(err);
    });
});

exports.getAsyncBoards = functions.https.onRequest(async (req, res) => {
  try {
    const dataSnapshot = await admin
      .firestore()
      .collection('boards')
      .get();

    let boards = [];

    dataSnapshot.forEach(doc => {
      boards.push(doc.data());
    });
    return res.json(users);
  } catch (err) {
    console.log(err.message);
  }
});

// https://us-central1-funfunretro.cloudfunctions.net/getUsers
exports.getUsers = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection('users')
    .get()
    .then(data => {
      let users = [];
      data.forEach(doc => {
        users.push(doc.data());
      });
      return res.json(users);
    })
    .catch(err => {
      console.log(err);
    });
});
