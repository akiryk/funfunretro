const { ApolloServer } = require('apollo-server-express');

const { typeDefs } = require('./gql/schema');
const resolvers = require('./gql/resolvers');

exports.server = new ApolloServer({ typeDefs, resolvers });
