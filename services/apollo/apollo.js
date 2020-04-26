/**
 * Apollo Server
 *
 * instantiate a new ApolloServer. and use context to pass down
 * user authentication and data loaders to the resolvers.
 *
 * getAuthUser gets a Bearer token from the Authorization header and
 * uses firebase-admin auth to verify the user
 *
 * loaders use data-loader to improve performance in Graphql queries
 *
 * @module apollo
 *
 */
const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('../gql/schema');
const resolvers = require('../gql/resolvers');
const { getAuthUser } = require('../firebase/auth_user');
const {
  usersByBoardIdsDataLoader,
  usersByUserIdDataLoader,
} = require('../firebase/user');

exports.server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    user: await getAuthUser(req),
    loaders: {
      usersByBoardIdLoader: usersByBoardIdsDataLoader(),
      usersByUserIdLoader: usersByUserIdDataLoader(),
      // todo: boardsByUserIdLoader
    },
  }),
  introspection: true,
  playground: true,
});
