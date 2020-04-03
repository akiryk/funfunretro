/**
 * Index
 *
 * https://us-east1-funfunretro.cloudfunctions.net/api/boards
 */

//
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firebase = require('firebase');
const config = require('./utils/config.js');
firebase.initializeApp(config);

var serviceAccount = require('./utils/serviceAccountKey.json');

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

const { typeDefs } = require('./gql/schema');
const resolvers = require('./gql/resolvers');

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: '/graphql', cors: true });

// Graphql endpoint
exports.api = functions.region('us-east1').https.onRequest(app);

// TODO: The api calls won't work as long as ApolloServer is running (below).
// TODO: Use a different auth system, no api -- or else investigate
// rest api
exports.rest = functions.region('us-east1').https.onRequest(app);

// Test signup
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  // TODO: validation

  const { email, password } = newUser;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((data) => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signed up successfully!` });
    })
    .catch((err) => {
      console.log(error);
      return res.status(500).json({ error: err.code });
    });
});

app.get('/boards', (req, res) => {
  console.log('GET BOARDS');
  admin
    .firestore()
    .collection('boards')
    .get()
    .then((boards) => {
      const data = boards.docs.map((board) => board.data());
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get('/columns', (req, res) => {
  console.log('GET COLUMNS');
  admin
    .firestore()
    .collection('columns')
    .get()
    .then((columns) => {
      const data = columns.docs.map((column) => column.data());
      return res.json(data);
    })
    .catch((error) => {
      console.log(error);
    });
});
