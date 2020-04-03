const admin = require('firebase-admin');

var serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://funfunretro.firebaseio.com',
});

const { ApolloServer } = require('apollo-server-express');

const { typeDefs } = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

module.exports = { server };
