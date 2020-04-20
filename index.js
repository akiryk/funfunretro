/**
 * Index
 *
 */

const functions = require('firebase-functions');
const express = require('express');
const { server } = require('./services/apollo/apollo');
// const { db, admin } = require('./services/firebase/utils/firebase');
// const FbAuth = require('./utils/fb_auth');

const app = express();

// not necessary for graphql, only REST
const cors = require('cors');
app.use(cors());

server.applyMiddleware({ app, path: '/', cors: true });

// Graphql endpoing: https://us-east1-funfunretro.cloudfunctions.net/api/
exports.api = functions.region('us-east1').https.onRequest(app);

// Only works when deployed
// Listens for any document created in the users collection
// TODO: Add region for faster update
// exports.updateComment = functions.firestore
//   .document('comments/{commentId}')
//   .onUpdate((change, context) => {
//     console.log('before', change.before.data());
//     console.log('after', change.after.data());
//     console.log('context.params', context.params);
//     let n = 0;
//     if (change.before.data().likes < change.after.data().likes) {
//       n = 1;
//     }
//     if (change.before.data().likes > change.after.data().likes) {
//       n = -1;
//     }

//     const { boardId } = change.after.data();
//     // only update likes if they've changed
//     if (n !== 0) {
//       console.log('should update board!');
// return db.doc(`boards/${boardId}`).set(
//         {
//           likesByUser: {
//             [userName]: admin.firestore.FieldValue.increment(n),
//           },
//         },
//         { merge: true }
//       );
//     }
//     return change.after.data();
//   });
