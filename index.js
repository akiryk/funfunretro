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
