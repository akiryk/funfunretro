/**
 * User Queries
 */
const {
  getCollection,
  getByIdFromCollection,
} = require('../../helpers/gql_helpers');
const { admin } = require('../../utils/admin');

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
    console.log(error);
  }
};

exports.getUser = async (_, { id }) => {
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

exports.getUserBoards = async (user) => {
  console.log('get user boards', user.id);
  try {
    const userBoards = await admin
      .firestore()
      .collection('boards')
      .where('userIds', 'array-contains', user.id)
      .get();
    console.log('we are here');
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

exports.getUserComments = async (user) => {
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
