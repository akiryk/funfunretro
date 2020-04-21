const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('../gql/schema');
const resolvers = require('../gql/resolvers');
const { admin, db } = require('../firebase/utils/app_config');
const {
  usersDataLoader,
  usersByBoardsDataLoader,
} = require('../firebase/user');

const getUser = (req) => {
  let idToken;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('No token found');
    return;
  }
  return admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection('users')
        .where('uid', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      return {
        ...data.docs[0].data(),
        userName: data.docs[0].id,
      };
    })
    .catch((err) => {
      console.log('Error while verifying token; probably expired');
      return; // return null because there's no user
    });
};

exports.server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    user: await getUser(req),
    loaders: {
      usersLoader: usersDataLoader(),
    },
  }),
  introspection: true,
  playground: true,
});
