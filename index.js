/**
 * Index
 *
 */

const functions = require('firebase-functions');
const express = require('express');
const { server } = require('./services/apollo/apollo');

const app = express();

// not necessary for graphql, only REST
// const cors = require('cors');
// app.use(cors());

server.applyMiddleware({ app, path: '/', cors: true });

exports.api = functions.region('us-east1').https.onRequest(app);
