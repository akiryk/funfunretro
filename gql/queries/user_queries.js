/**
 * User Queries
 */
const {
  getCollection,
  getByIdFromCollection,
} = require('../../helpers/gql_helpers');
const { admin } = require('../../utils/firebase');

const errorMsg = [
  {
    message: 'you must be logged in to view user level data',
    code: '400',
    success: false,
    id: '',
  },
];

exports.getUsers = async (_, __, user) => {
  if (!user.roles) {
    return errorMsg;
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

exports.getUser = async (_, { id }, user) => {
  if (!user.roles) {
    return errorMsg;
  }
  try {
    const user = await getByIdFromCollection(id, 'users');
    return {
      ...user.data(),
      id,
    };
  } catch (error) {
    console.log(error);
  }
};

exports.getUserBoards = async (user, _, loggedInUser) => {
  if (!loggedInUser.roles) {
    return errorMsg;
  }
  try {
    const userBoards = await admin
      .firestore()
      .collection('boards')
      .where('userIds', 'array-contains', user.id)
      .get();
    return userBoards.docs.map((board) => {
      return {
        ...board.data(),
        id: board.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserComments = async (user, _, loggedInUser) => {
  if (!loggedInUser.roles) {
    return errorMsg;
  }
  try {
    const userComments = await admin
      .firestore()
      .collection('comments')
      .where('userId', '==', user.id)
      .get();
    return userComments.docs.map((comment) => {
      return {
        ...comment.data(),
        id: comment.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};
