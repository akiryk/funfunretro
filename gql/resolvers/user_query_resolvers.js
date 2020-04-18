/**
 * User Queries
 */
const {
  getCollection,
  getByIdFromCollection,
  getFromCollectionWhere,
  getDocFromCollection,
} = require('../../helpers/gql_helpers');
const { isMember, isAdmin } = require('../../helpers/resolver_helpers');
const {
  getErrorResponse,
  getSuccessResponse,
} = require('../../helpers/resolver_helpers');

const errorMsg = {
  response: {
    message: 'you must be logged in to view user level data',
    code: '400',
    success: false,
  },
  id: '',
  uid: '',
};

exports.getUsers = async (_, __, user) => {
  if (!isMember(user)) {
    return [errorMsg];
  }
  const { userName } = user;
  try {
    const users = await getCollection('users');
    return users.docs.map((user) => {
      return {
        ...user.data(),
        // for ease of use, let people query for id or userName even though they're the same
        id: userName,
        userName,
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
  const { userName } = user;
  try {
    const doc = await getDocFromCollection(userName, 'users');
    if (doc.exists) {
      return {
        ...doc.data(),
        userName,
        id: userName,
        response: getSuccessResponse(),
      };
    } else {
      console.log('No such document!');
      return errorMsg;
    }
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
    if (user.exists) {
      return {
        ...user.data(),
        userName: userId,
        id: userId,
        response: getSuccessResponse(),
      };
    } else {
      return {
        id: '',
        uid: '',
        response: getErrorResponse("Welp, there isn't a user by that name."),
      };
    }
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
        response: getSuccessResponse(),
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserComments = async (userDoc, _, user) => {
  if (!isAdmin(user)) {
    return [
      {
        id: '',
        uid: '',
        response: getErrorResponse(
          'You must be an admin to request user comments.'
        ),
      },
    ];
  }
  try {
    const userComments = await getFromCollectionWhere({
      collection: 'comments',
      targetProp: 'userName',
      matches: '==',
      sourceProp: userDoc.id,
    });
    return userComments.docs.map((comment) => {
      return {
        ...comment.data(),
        id: comment.id,
        response: getSuccessResponse(),
      };
    });
  } catch (error) {
    console.log(error);
  }
};
