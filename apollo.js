const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('./gql/schema');
const resolvers = require('./gql/resolvers');
const { admin, db } = require('./utils/firebase');

const getUser = (req) => {
  let idToken;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
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
        userName: data.docs[0].data().userName,
        email: data.docs[0].data().email,
        roles: data.docs[0].data().roles,
        uid: req.user.uid,
      };
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return;
    });
};

exports.server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    try {
      const user = await getUser(req);
      if (!user) {
        return null;
      }
      // add the user to the context
      return user;
    } catch (error) {
      console.log(error);
    }
  },
  introspection: true,
  playground: true,
});
