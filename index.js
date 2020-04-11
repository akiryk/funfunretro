/**
 * Index
 *
 * https://us-east1-funfunretro.cloudfunctions.net/api/boards
 */

const functions = require('firebase-functions');
const express = require('express');
const { server } = require('./apollo');
// const cors = require('cors');

const app = express();
// app.use(cors());

// Endpoint
exports.api = functions.region('us-east1').https.onRequest(app);

// Graphql
server.applyMiddleware({ app, path: '/graphql', cors: true });

// Rest
const { signup, login } = require('./handlers/users');
// const { getBoards } = require('./handlers/boards');
// const { getColumns } = require('./handlers/columns');

app.post('/signup', signup);
app.post('/login', login);
// app.get('/boards', getBoards);
// app.get('/columns', getColumns);
