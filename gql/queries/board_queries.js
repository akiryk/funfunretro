/**
 * Board Queries
 */
const {
  getCollection,
  getByIdFromCollection,
} = require('../../helpers/gql_helpers');
const { admin } = require('../../utils/admin');

exports.getBoards = async () => {
  try {
    const boards = await getCollection('boards');
    return boards.docs.map((board) => {
      return {
        ...board.data(),
        id: board.id,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getBoard = async (_, { id }) => {
  try {
    const board = await getByIdFromCollection(id, 'boards');
    return {
      ...board.data(),
      id,
    };
  } catch (error) {
    console.log(error);
  }
};

exports.getBoardUsers = async (board) => {
  try {
    const boardUsers = await admin
      .firestore()
      .collection('users')
      .where('boardIds', 'array-contains', board.id)
      .get();
    return boardUsers.docs.map((user) => {
      return {
        ...user.data(),
        id: user.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getBoardColumns = async (board) => {
  try {
    const boardColumns = await admin
      .firestore()
      .collection('columns')
      .where('boardId', '==', board.id)
      .get();
    return boardColumns.docs.map((column) => {
      return {
        ...column.data(),
        id: column.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getBoardComments = async (board) => {
  try {
    const boardComments = await admin
      .firestore()
      .collection('comments')
      .where('boardId', '==', board.id)
      .get();
    return boardComments.docs.map((comment) => {
      return {
        ...comment.data(),
        id: comment.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};
