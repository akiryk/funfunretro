const DataLoader = require('dataloader');
/**
 * Firestore User Service
 */
const { db, admin } = require('./utils/app_config');
const {
  getCollection,
  getFromCollectionWhere,
  getErrorResponse,
  getGenericMutationResponseForError,
} = require('./utils/firestore_helpers');

const errorMsg = {
  response: getErrorResponse(),
  id: '',
  uid: '',
};

exports.getUsers = async () => {
  try {
    const users = await getCollection('users');
    return users.docs.map((user) => {
      return {
        ...user.data(),
        id: user.id,
      };
    });
  } catch (error) {
    return errorMsg;
  }
};

/**
 * Get a user profile
 *
 * @param {string} userName - the user.id
 */
exports.getUserById = async (id) => {
  try {
    const doc = await db.collection('users').doc(id).get();
    if (doc.exists) {
      return doc.data();
    } else {
      return 'Doc does not appear to exist';
    }
  } catch (error) {
    return error.message;
  }
};

const getUsersByUserIds = async (userNames) => {
  console.log('======Get Users By User IDs======');
  const data = await Promise.all(
    userNames.map(
      async (userName) => await db.collection('users').doc(userName).get()
    )
  );
  return data.map((user) => ({
    ...user.data(),
    id: user.id,
  }));
};

exports.usersByUserIdDataLoader = () => new DataLoader(getUsersByUserIds);

const getUsersByBoardIds = async (boardIds) => {
  const data = await Promise.all(
    boardIds.map(
      async (boardId) =>
        await db
          .collection('users')
          .where('boardIds', 'array-contains', boardId)
          .get()
    )
  );
  return data.map((users) =>
    users.docs.map((user) => ({
      ...user.data(),
      id: user.id,
    }))
  );
};

exports.usersByBoardIdsDataLoader = () => new DataLoader(getUsersByBoardIds);

/**
 * TODO: Remove this, it's not used once data loaders are all set up.
 * A board has anywhere from 0 to many users
 * This returns those users
 *
 * @param {string} boardId - the id of the board
 * @return {object} either the User or an error response
 */
// TODO: remove this eventually, it isn't used anymore because of data loader
// exports.getUsersByBoardId = async (boardId) => {
//   console.log('_____Get Users By Board ID______');
//   try {
//     const boardUsers = await getFromCollectionWhere({
//       collection: 'users',
//       targetProp: 'boardIds',
//       matches: 'array-contains',
//       sourceProp: boardId,
//     });
//     console.log(`Get users for ${boardId}`);
//     return boardUsers.docs.map((user) => {
//       return {
//         ...user.data(),
//         // must include id/userName since that won't be on root since root was a board
//         id: user.id,
//       };
//     });
//   } catch (error) {
//     console.log(error);
//     return {
//       id: '',
//       response: {
//         message: error,
//         code: '500',
//         success: false,
//       },
//     };
//   }
// };

exports.createUser = async ({
  userName,
  uid,
  role = MEMBER_ROLE,
  email = '',
  boardIds = [],
}) => {
  console.log('let us careate', userName, uid);
  let cleanUserName = userName.replace(/\s+/g, '');
  try {
    const user = await db.collection('users').doc(uid).get();
    if (user.exists) {
      return {
        code: '400',
        success: false,
        message: `oooh, that userName is already taken`,
      };
    }
    await admin.firestore().collection('users').doc(uid).set({
      userName: cleanUserName,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      role,
      boardIds,
    });
    return {
      code: '200',
      success: true,
      message: `Successfully created new user, ${cleanUserName}`,
      user: {
        userName: cleanUserName,
        roles,
        email,
        boardIds,
        id: uid,
      },
    };
  } catch (error) {
    return {
      code: '500',
      success: false,
      message: 'failed to create user for some server reason',
    };
  }
};

// TODO: when deleting a user, should we delete the user comments as well?
exports.deleteUser = async (_, { input: args }) => {
  if (!args || !args.id) {
    return {
      code: '400',
      success: false,
      message: `Sorry, but you never gave a user id`,
    };
  }
  const userToDelete = db.doc(`/users/${args.id}`);
  try {
    const userDoc = await userToDelete.get();
    if (!userDoc.exists) {
      return {
        code: '400',
        success: false,
        message: `User with id ${args.id} does not exist`,
      };
    }
    await userToDelete.delete();
    return {
      code: '200',
      success: true,
      message: `User ${args.id} deleted successfully`,
    };
  } catch (error) {
    console.log(error);
    return getGenericMutationResponseForError('delete', 'user');
  }
};
