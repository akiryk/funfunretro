const { ApolloServer } = require('apollo-server-express');
const { typeDefs } = require('../gql/schema');
const resolvers = require('../gql/resolvers');
const { admin, db } = require('../firebase/utils/app_config');
const {
  usersByBoardIdsDataLoader,
  usersByUserIdDataLoader,
} = require('../firebase/user');

const getUser = async (req) => {
  let idToken;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('No token found');
    return {
      isMember: false,
    };
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // get the user record with additional data about roles and username
    const userRecord = await admin.auth().getUser(uid);
    const userName = userRecord.displayName;
    const role = userRecord.customClaims['role'];

    const user = {
      uid,
      role,
      userName,
      email,
    };
    // if (req.user.admin) {
    //   user.role = 'ADMIN';
    // }
    // if (req.user.editor) {
    //   user.role = 'EDITOR';
    // }
    console.log('USER IS:', user);
    return user;
  } catch (err) {
    console.log('Error while verifying token; probably expired');
    return {
      isMember: false,
    };
  }
};

exports.server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    user: await getUser(req),
    loaders: {
      usersByBoardIdLoader: usersByBoardIdsDataLoader(),
      usersByUserIdLoader: usersByUserIdDataLoader(),
    },
  }),
  introspection: true,
  playground: true,
});
