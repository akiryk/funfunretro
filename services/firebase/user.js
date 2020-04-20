/**
 * Firestore User Service
 */
const { db, admin } = require('./utils/firebase');
const { isMember, isAdmin } = require('./utils/auth_helpers');
const {
  getCollection,
  getByIdFromCollection,
  getFromCollectionWhere,
  getDocFromCollection,
  getErrorResponse,
  getSuccessResponse,
  getGenericMutationResponseForError,
} = require('./utils/firestore_helpers');

const errorMsg = {
  response: {
    message: 'you must be logged in to view user level data',
    code: '400',
    success: false,
  },
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
        userName: user.id, // userName == user.id
      };
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get a user profile
 *
 * @param {string} userName - the user.id
 */
exports.getUserById = async (userName) => {
  try {
    const doc = await getDocFromCollection(userName, 'users');
    if (doc.exists) {
      return {
        ...doc.data(),
        id: doc.id,
        userName: doc.id, // userName === user.id
        response: getSuccessResponse(),
      };
    } else {
      return errorMsg;
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * A board has anywhere from 0 to many users
 * This returns those users
 *
 * @param {string} boardId - the id of the board
 * @return {object} either the User or an error response
 */
exports.getUsersByBoardId = async (boardId) => {
  try {
    const boardUsers = await getFromCollectionWhere({
      collection: 'users',
      targetProp: 'boardIds',
      matches: 'array-contains',
      sourceProp: boardId,
    });
    return boardUsers.docs.map((user) => {
      return {
        ...user.data(),
        // must include id/userName since that won't be on root since root was a board
        id: user.id,
        userName: user.id,
      };
    });
  } catch (error) {
    console.log(error);
    return {
      id: '',
      response: {
        message: error,
        code: '500',
        success: false,
      },
    };
  }
};

exports.createUser = async (_, { input: args, uid }) => {
  let userName = args.userName.replace(/\s+/g, '');
  try {
    const user = await getByIdFromCollection(userName, 'users');
    if (user.exists) {
      return {
        code: '400',
        success: false,
        message: `oooh, that userName is already taken`,
      };
    }
    const roles = args.roles || [MEMBER_ROLE];
    const email = args.email || '';
    const boardIds = args.boardIds || [];
    const uid = args.uid || '';
    await admin.firestore().collection('users').doc(userName).set({
      userName,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      uid,
      roles,
      boardIds,
    });
    return {
      code: '200',
      success: true,
      message: `Successfully created new user, ${userName}`,
      user: {
        userName,
        roles,
        email,
        boardIds,
        id: userName,
      },
    };
  } catch (error) {
    console.log(error);
    return getErrorResponse('unable to create a user');
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
