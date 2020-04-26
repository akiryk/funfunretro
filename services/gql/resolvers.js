const {
  boards,
  board,
  myBoards,
  boardChildQueries,
} = require('./queries/board_query_resolvers.js');

const {
  column,
  columns,
  columnChildQueries,
} = require('./queries/column_query_resolvers.js');

const {
  comment,
  comments,
  commentChildQueries,
} = require('./queries/comment_query_resolvers.js');

const {
  user,
  users,
  userChildQueries,
  me,
} = require('./queries/user_query_resolvers.js');

// Mutations

const {
  createBoard,
  updateBoard,
} = require('./mutations/board_mutation_resolvers');

const {
  createColumn,
  updateColumn,
  deleteColumn,
} = require('./mutations/column_mutation_resolvers');

const {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require('./mutations/comment_mutation_resolvers');

const {
  login,
  signup,
  addRole,
} = require('./mutations/auth_mutation_resolvers');

const { deleteUser } = require('./mutations/user_mutation_resolvers');

module.exports = {
  Query: {
    boards,
    board,
    myBoards,
    columns,
    column,
    comments,
    comment,
    user,
    users,
    me,
  },
  Board: boardChildQueries,
  Column: columnChildQueries,
  Comment: commentChildQueries,
  User: userChildQueries,
  Mutation: {
    createBoard,
    updateBoard,
    createColumn,
    updateColumn,
    deleteColumn,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
    login,
    signup,
    addRole,
    deleteUser,
  },
  MutationResponse: {
    __resolveType(obj, context, info) {
      return null;
    },
  },
};
