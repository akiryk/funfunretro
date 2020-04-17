/**
 * Index
 *
 */

const functions = require('firebase-functions');
const express = require('express');
const { server } = require('./apollo');
const { db } = require('./utils/firebase');
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
exports.updateComment = functions.firestore
  .document('comments/{commentId}')
  .onUpdate((change, context) => {
    console.log('before', change.before.data());
    console.log('after', change.after.data());
    console.log('context.params', context.params);
    db.doc('users/akiryk')
      .update({
        newProp: 'New Property!',
      })
      .then(() => {
        return;
      });
    // perform desired operations ...
  });
