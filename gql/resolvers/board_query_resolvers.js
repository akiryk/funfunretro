/**
 * Board Queries
 */
const {
  getCollection,
  getByIdFromCollection,
} = require('../../helpers/gql_helpers');
const { db } = require('../../utils/firebase');

/*
 * Get Boards resolver
 * Permissions: Anyone can view boards
 */
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
    return {
      id: '',
      error: {
        message: err,
        code: '500',
        success: false,
      },
    };
  }
};

/*
 * Get Board resolver
 * Permissions: Only members, editors, admin, can view a board by id
 */
exports.getBoard = async (_, { id }, user) => {
  // any user role will do
  if (!user.roles) {
    // only logged in users can see a board
    return {
      id: '',
      error: {
        message: 'you must be logged in to view a board',
        code: '400',
        success: false,
      },
    };
  }
  try {
    const board = await getByIdFromCollection(id, 'boards');
    return {
      ...board.data(),
      id,
    };
  } catch (error) {
    console.log(error);
    return {
      id: '',
      error: {
        message: error,
        code: '500',
        success: false,
      },
    };
  }
};

exports.getBoardUsers = async (board, _, user) => {
  if (!user.roles) {
    // only logged in users can see a board
    return [
      {
        id: '',
        error: {
          message: 'you must be logged in to view users of a board',
          code: '400',
          success: false,
        },
      },
    ];
  }
  try {
    const boardUsers = await db
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
    return {
      id: '',
      error: {
        message: error,
        code: '500',
        success: false,
      },
    };
  }
};

exports.getBoardColumns = async (board, _, user) => {
  if (!user.roles) {
    return [
      {
        id: '',
        error: {
          message: 'must be logged in to view colums',
          code: '400',
          success: false,
        },
      },
    ];
  }
  try {
    const boardColumns = await db
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
    return {
      id: '',
      error: {
        message: error,
        code: '500',
        success: false,
      },
    };
  }
};

exports.getBoardComments = async (board, _, user) => {
  if (!user.roles) {
    // only logged in users can see a board
    return [
      {
        id: '',
        error: {
          message: 'you must be logged in to view comments on a board',
          code: '400',
          success: false,
        },
      },
    ];
  }
  try {
    const boardComments = await db
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
    return {
      id: '',
      error: {
        message: error,
        code: '500',
        success: false,
      },
    };
  }
};
