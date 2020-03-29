/**
 * Index
 *
 * https://us-east1-funfunretro.cloudfunctions.net/api/boards
 */

//
const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://funfunretro.firebaseio.com',
});

const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const app = express();

const { typeDefs } = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: '/', cors: true });
exports.graphql = functions.region('us-east1').https.onRequest(app);

// exports.api = functions.region('us-east1').https.onRequest(app);

app.get('/boards', (req, res) => {
  admin
    .firestore()
    .collection('boards')
    .get()
    .then(boardData => {
      let boards = [];
      boardData.forEach(board => {
        boards.push(board.data());
      });
      return res.json(boards);
    })
    .catch(error => {
      console.log(error);
    });
});

app.get('/columns', (req, res) => {
  admin
    .firestore()
    .collection('columns')
    .get()
    .then(columnsData => {
      let columns = [];
      columnsData.forEach(column => {
        columns.push(column.data());
      });
      return res.json(columns);
    })
    .catch(error => {
      console.log(error);
    });
});

// get a board's information and also its columns, version 1
// - in which we first get all columns that match a given boardId
// - then we get the board data based on that id
app.get('/boards/:boardId', (req, res) => {
  let columns = [];
  admin
    .firestore()
    .collection('columns')
    .where('boardId', '==', req.params.boardId)
    .get()
    .then(columnsData => {
      columnsData.forEach(column => {
        columns.push(column.data());
      });
      admin
        .firestore()
        .collection('boards')
        .doc(req.params.boardId)
        .get()
        .then(doc => {
          if (doc.exists) {
            const board = doc.data();
            const d = {
              board,
              columns,
            };
            return res.json(d);
          } else {
            throw new Error('did not work');
          }
        });
    })
    .catch(error => {
      console.log(error);
    });
});

// The Firebase Admin SDK to access the Firebase Realtime Database.
// const admin = require('firebase-admin');

// var serviceAccount = require('../serviceAccountKey.json');

// const app = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://funfunretro.firebaseio.com',
// });

// const db = admin.firestore(app);

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

// exports.helloWorld = functions.https.onRequest((req, res) => {
//   res.send('Yes, hello to the entire world!');
// });

//us-central1-funfunretro.cloudfunctions.net/getBoards
// exports.getBoards = functions.https.onRequest(async (request, response) => {
//   try {
//     const boards = await db.collection('boards').get();
//     console.log(typeof boards);
//     console.log(Array.isArray(data));
//     console.log('boards', boards);
//     // const boardNames = boards.map(board => board.data()).join(', ');
//     return response.json(boards);
//   } catch (err) {
//     console.log(err);
//     console.log(err.message);
//   }
// });
/*
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
      .collection('boardes')
      .get();

    let boards = [];

    dataSnapshot.forEach(doc => {
      boards.push(doc.data());
    });
    return res.json(boards);
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

/**
 * Example queries and mutations
 */

/**
 * Add a user
 */
// exports.addUser = functions.https.onRequest((req, res) => {
//   return db
//     .collection('users')
//     .add({
//       first: 'Ada',
//       last: 'Lovelace',
//       born: 1815,
//     })
//     .then(function(docRef) {
//       console.log('Document written with ID: ', docRef.id);
//     })
//     .catch(function(error) {
//       console.error('Error adding document: ', error);
//     });
// });

/**
 * Get a user WHERE
 */

// exports.getUserWhere = functions.https.onRequest((req, res) => {
//   // admin.firestore().collection('users') or db.collection('users'); both work
//   db.collection('users')
//     .where('username', '==', 'alovelace')
//     .get()
//     .then(function(querySnapshot) {
//       querySnapshot.forEach(function(doc) {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, ' => ', doc.data());
//         return res.json(doc.data());
//       });
//     })
//     .catch(function(error) {
//       console.log('Error getting documents: ', error);
//     });
// });

// exports.getColumnsWhere = functions.https.onRequest((req, res) => {
//   console.log(req.query.boardId);
//   db.collection('columns')
//     .where('boardId', '==', 'zVgy7b43Uj7xJrZo2GIE')
//     .get()
//     .then(function(querySnapshot) {
//       const columns = [];
//       querySnapshot.forEach(function(doc) {
//         columns.push(doc.data());
//       });
//       return res.json(columns);
//     })
//     .catch(function(error) {
//       console.log('Error getting documents: ', error);
//     });
// });

// exports.getColumnsByBoardIdr = functions.https.onRequest((req, res) => {
//   db.collection('columns')
//     .where('boardId', '==', `fSOyvOyR3k1owjAKv88o`)
//     .get()
//     .then(snapshot => {
//       const columns = [];
//       console.log(req.query.boardId);
//       snapshot.forEach(doc => {
//         console.log('hello ????? ');
//         console.log(doc.data());
//         columns.push(doc.data());
//       });
//       return res.json(columns);
//     })
//     .catch(error => console.log('error', error));
// });

// exports.getColumnsByBoardId = functions.https.onRequest((req, res) => {
//   console.log(req.params.id);
//   let boardData = {};
//   db.doc(`/boards/{req.params.id}`)
//     .get()
//     .then(board => {
//       if (!board.exists) {
//         return res.status(404).json({ error: { message: 'Board not found' } });
//       }
//       boardData = board.data();
//       boardData.id = board.id;
//       console.log('board data: ', board.data());
//       return db
//         .collection('columns')
//         .orderBy('createdAt', 'desc')
//         .where('boardId', '==', 'fSOyvOyR3k1owjAKv88o')
//         .get();
//     })
//     .then(columns => {
//       boardData.columns = [];
//       columns.forEach(column => {
//         boardData.columns.push(column.data());
//       });
//       return res.json(boardData);
//     })
//     .catch(error => console.log('error', error));
// });
