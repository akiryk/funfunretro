/**
 * User Queries
 */
const {
  getCollection,
  getByIdFromCollection,
  getFromCollectionWhere,
} = require('../../helpers/gql_helpers');
const { isMember, isAdmin } = require('../../helpers/resolver_helpers');

const errorMsg = {
  response: {
    message: 'you must be logged in to view user level data',
    code: '400',
    success: false,
  },
  id: '',
  uid: '',
};

const successResponse = {
  message: 'Yes, it worked',
  code: '200',
  success: true,
};

exports.getUsers = async (_, __, user) => {
  if (!isMember(user)) {
    return [errorMsg];
  }
  try {
    const users = await getCollection('users');
    return users.docs.map((user) => {
      return {
        ...user.data(),
        id: user.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.whoAmI = async (_, __, user) => {
  if (!isMember(user)) {
    return errorMsg;
  }
  try {
    const userDoc = await getByIdFromCollection(user.userName, 'users');
    return {
      ...userDoc.data(),
      response: successResponse,
    };
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get a user profile
 *
 * @param {object}
 * @param {object} args - we only need the id argument
 * @param {object} context - the context is the user making the req. We need that user's roles
 */
exports.getUser = async (_, { id: userId }, user) => {
  if (!isMember(user)) {
    return errorMsg;
  }
  try {
    const user = await getByIdFromCollection(userId, 'users');
    return {
      ...user.data(),
      response: successResponse,
    };
  } catch (error) {
    console.log(error);
  }
};

exports.getUserBoards = async (userDoc, _, user) => {
  if (!isMember(user)) {
    return [errorMsg];
  }
  try {
    const userBoards = await admin
      .firestore()
      .collection('boards')
      .where('userIds', 'array-contains', userDoc.id)
      .get();
    return userBoards.docs.map((board) => {
      return {
        ...board.data(),
        id: board.id,
        response: successResponse,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserComments = async (userDoc, _, user) => {
  if (!isMember(user)) {
    return [errorMsg];
  }
  try {
    const userComments = await admin
      .firestore()
      .collection('comments')
      .where('userId', '==', userDoc.id)
      .get();
    return userComments.docs.map((comment) => {
      return {
        ...comment.data(),
        id: comment.id,
        response: successResponse,
      };
    });
  } catch (error) {
    console.log(error);
  }
};
