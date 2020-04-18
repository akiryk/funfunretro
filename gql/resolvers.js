// Queries
const {
  getBoards,
  getBoardById,
  getMyBoards,
  getBoardUsers,
  getBoardComments,
  getBoardColumns,
} = require('./resolvers/board_query_resolvers');
const {
  getColumns,
  getColumn,
  getColumnComments,
} = require('./resolvers/column_query_resolvers');
const {
  getComments,
  getComment,
  getCommentUser,
} = require('./resolvers/comment_query_resolvers');
const {
  getUsers,
  getUser,
  whoAmI,
  getUserBoards,
  getUserComments,
} = require('./resolvers/user_query_resolvers');
// Mutations
const {
  createBoard,
  updateBoard,
} = require('./resolvers/board_mutation_resolvers');
const {
  createColumn,
  updateColumn,
  deleteColumn,
} = require('./resolvers/column_mutation_resolvers');
const {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require('./resolvers/comment_mutation_resolvers');
const {
  createUser,
  deleteUser,
} = require('./resolvers/user_mutation_resolvers');
const { signup, login } = require('./resolvers/auth_user_mutation_resolvers');

module.exports = {
  Query: {
    boards: (_, __, { user }) => getBoards(user),
    board: (_, { id }, { user }) =>
      getBoardById(id, { role: user.role, boardIds: user.boardIds }),
    myBoards: getMyBoards,
    columns: getColumns,
    column: getColumn,
    comments: getComments,
    comment: getComment,
    users: getUsers,
    user: getUser,
    whoAmI: whoAmI,
  },
  Mutation: {
    createBoard,
    createColumn,
    createUser,
    signup,
    login,
    createComment,
    updateBoard,
    updateColumn,
    updateComment,
    likeComment,
    unlikeComment,
    deleteComment,
    deleteColumn,
    deleteUser,
  },
  Board: {
    users: getBoardUsers,
    columns: getBoardColumns,
    comments: getBoardComments,
    // name: (parent) => parent.name, // not necessary because name is the same
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
