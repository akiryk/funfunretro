/**
 * Board Queries
 */
const {
  getCollection,
  getByIdFromCollection,
  getFromCollectionWhere,
} = require('../../helpers/gql_helpers');
const { isMember, isAdmin } = require('../../helpers/resolver_helpers');

const inadequatePermissionsMsg = {
  id: '',
  response: {
    message: 'inadequate permissions, sorry',
    code: '400',
    success: false,
  },
};

/*
 * Get Boards resolver
 * Permissions: Only Admins can view all boards
 */
exports.getBoards = async (_, __, user) => {
  if (!isAdmin(user)) {
    return [inadequatePermissionsMsg];
  }
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
      response: {
        message: err,
        code: '500',
        success: false,
      },
    };
  }
};

/*
 * Get boards for a given user
 */
exports.getMyBoards = async (_, __, user) => {
  if (!isMember(user)) {
    return [inadequatePermissionsMsg];
  }
  try {
    const boards = await getFromCollectionWhere({
      collection: 'boards',
      targetProp: 'userNames',
      matches: 'array-contains',
      sourceProp: user.userName,
    });

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
      response: {
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
exports.getBoard = async (_, { id = '' } = {}, user) => {
  // any user role will do
  if (!isAdmin(user)) {
    return inadequatePermissionsMsg;
  }

  if (!id) {
    // only logged in users can see a board
    return {
      id: '',
      response: {
        message: 'no board id provided',
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
      response: {
        message: error,
        code: '500',
        success: false,
      },
    };
  }
};

exports.getBoardUsers = async (board, _, user) => {
  if (!isMember(user)) {
    return [
      {
        id: '',
        response: {
          message: 'you must be logged in to view users of a board',
          code: '400',
          success: false,
        },
      },
    ];
  }
  try {
    const boardUsers = await getFromCollectionWhere({
      collection: 'users',
      targetProp: 'boardIds',
      matches: 'array-contains',
      sourceProp: board.id,
    });
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
      response: {
        message: error,
        code: '500',
        success: false,
      },
    };
  }
};

exports.getBoardColumns = async (board, _, user) => {
  if (!isMember(user)) {
    return [
      {
        id: '',
        response: {
          message: 'must be logged in to view colums',
          code: '400',
          success: false,
        },
      },
    ];
  }
  try {
    const boardColumns = await getFromCollectionWhere({
      collection: 'columns',
      targetProp: 'boardId',
      matches: '==',
      sourceProp: board.id,
    });
    return boardColumns.docs.map((column) => {
      return {
        ...column.data(),
        id: column.id,
      };
    });
  } catch (error) {
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

exports.getBoardComments = async (board, _, user) => {
  if (!isMember(user)) {
    // only logged in users can see a board
    return [
      {
        id: '',
        response: {
          message: 'you must be logged in to view comments on a board',
          code: '400',
          success: false,
        },
      },
    ];
  }
  try {
    const boardComments = await getFromCollectionWhere({
      collection: 'comments',
      targetProp: 'boardId',
      matches: '==',
      sourceProp: board.id,
    });

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
      response: {
        message: error,
        code: '500',
        success: false,
      },
    };
  }
};
