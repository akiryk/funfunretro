/**
 * Index
 *
 * https://us-east1-funfunretro.cloudfunctions.net/api/boards
 */

//
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firebase = require('firebase');
const config = require('../utils/config.js');
firebase.initializeApp(config);

var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://funfunretro.firebaseio.com',
});

const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const app = express();

// Cors
const cors = require('cors');
app.use(cors());

// const { typeDefs } = require('./schema');
// const resolvers = require('./resolvers');

// const server = new ApolloServer({ typeDefs, resolvers });
// server.applyMiddleware({ app, path: '/', cors: true });

// Graphql endpoint
// exports.graphql = functions.region('us-east1').https.onRequest(app);

// rest api
exports.api = functions.region('us-east1').https.onRequest(app);

// Test signup
app.post('/signup', (req, res) => {
  console.log('SIGN UP!');
  const newUser = {
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.passWord,
    confirmPassword: req.body.confirmPassword,
  };

  // TODO: validation

  const { email, password } = newUser;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(data => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signed up successfully!` });
    })
    .catch(err => {
      console.log(error);
      return res.status(500).json({ error: err.code });
    });
});
