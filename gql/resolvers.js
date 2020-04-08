// Queries
const {
  getBoards,
  getBoard,
  getBoardUsers,
  getBoardComments,
  getBoardColumns,
} = require('./queries/board_queries');
const {
  getColumns,
  getColumn,
  getColumnComments,
} = require('./queries/column_queries');
const {
  getComments,
  getComment,
  getCommentUser,
} = require('./queries/comment_queries');
const {
  getUsers,
  getUser,
  getUserBoards,
  getUserComments,
} = require('./queries/user_queries');
// Mutations
const { createBoard, updateBoard } = require('./mutations/board_mutations');
const {
  createColumn,
  updateColumn,
  deleteColumn,
} = require('./mutations/column_mutations');
const {
  createComment,
  updateComment,
  deleteComment,
} = require('./mutations/comment_mutations');
const { createUser, deleteUser } = require('./mutations/user_mutations');
const { createAuthUser, login } = require('./mutations/auth_user_mutations');

module.exports = {
  Query: {
    boards: getBoards,
    board: getBoard,
    columns: getColumns,
    column: getColumn,
    comments: getComments,
    comment: getComment,
    users: getUsers,
    user: getUser,
  },
  Mutation: {
    createBoard,
    createColumn,
    createUser,
    createAuthUser,
    login,
    createComment,
    updateBoard,
    updateColumn,
    updateComment,
    deleteComment,
    deleteColumn,
    deleteUser,
  },
  Board: {
    users: getBoardUsers,
    columns: getBoardColumns,
    comments: getBoardComments,
  },
  Column: {
    comments: getColumnComments,
  },
  Comment: {
    user: getCommentUser,
  },
  User: {
    boards: getUserBoards,
    comments: getUserComments,
  },
  MutationResponse: {
    __resolveType(obj, context, info) {
      return null;
    },
  },
};
