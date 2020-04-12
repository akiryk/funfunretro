/**
 * Index
 *
 */

const functions = require('firebase-functions');
const express = require('express');
const { server } = require('./apollo');
// const FbAuth = require('./utils/fb_auth');

const app = express();

// not necessary for graphql, only REST
const cors = require('cors');
app.use(cors());

// Graphql endpoing: https://us-east1-funfunretro.cloudfunctions.net/api/
exports.graphql = functions.region('us-east1').https.onRequest(app);

server.applyMiddleware({ app, path: '/', cors: true });
