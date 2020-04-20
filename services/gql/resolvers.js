const {
  getQueryErrorResponse,
  getMutationErrorResponse,
} = require('../firebase/utils/firestore_helpers');
const {
  isUserMember,
  isUserEditor,
  isUserAdmin,
} = require('../firebase/utils/auth_helpers');
// Queries
const {
  getBoards,
  getBoardById,
  getBoardsByUserName, // the boards to which a member belongs
  createBoard,
  updateBoard,
} = require('../firebase/board');
const {
  getColumns,
  getColumnById,
  getColumnsByBoardId, // the columns that belong to a particular board
} = require('../firebase/column');
const {
  getComments,
  getCommentById,
  getCommentsByBoardId,
  getCommentsByColumnId,
  getCommentsByUserId,
} = require('../firebase/comment');
const {
  getUsers,
  getUserById, // get user by userName (id === userName)
  getUsersByBoardId,
} = require('../firebase/user');

const { createColumn, updateColumn } = require('../firebase/column');
const {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} = require('../firebase/comment');
const { createUser, deleteUser } = require('../firebase/user');
const { signup, login } = require('../firebase/auth_user');

/**
 * Is the user a member of the given board
 *
 * @param {object} user
 * @param {string} boardId
 * @return {bool}
 */
const isUserMemberOfBoard = (user, boardId) =>
  user && user.boardIds && user.boardIds.includes(boardId);

module.exports = {
  Query: {
    boards: async (_, __, { user }) => {
      return isUserAdmin(user)
        ? getBoards()
        : [
            getQueryErrorResponse({
              props: { id: '' },
              message: 'you must be logged in as an admin',
            }),
          ];
    },
    board: async (_, { id }, { user }) => {
      if (isUserMemberOfBoard(user, id) || isUserAdmin(user)) {
        return getBoardById(id);
      }
      return getQueryErrorResponse({
        props: { id: '' },
        message: !isUserMember(user)
          ? 'you must be logged in'
          : 'you can not request boards to which you do not belong',
      });
    },
    myBoards: async (_, __, { user }) => {
      return isUserMember(user)
        ? getBoardsByUserName(user.userName)
        : [
            getQueryErrorResponse({
              props: { id: '' },
              message: 'you must be logged in',
            }),
          ];
    },
    columns: async (_, __, { user }) => {
      return isUserAdmin(user)
        ? getColumns()
        : [
            getQueryErrorResponse({
              props: { id: '' },
              message: 'you must be logged in as an admin for that',
            }),
          ];
    },
    column: async (_, { id }, { user }) => {
      return isUserAdmin(user)
        ? getColumnById(id, user.role)
        : getQueryErrorResponse({
            props: { id: '' },
            message: 'you must be logged in as an admin',
          });
    },
    comments: async (_, __, { user }) => {
      return isUserAdmin(user)
        ? getComments()
        : [
            getQueryErrorResponse({
              props: { id: '' },
              message: 'you must be logged in as an admin',
            }),
          ];
    },
    comment: (_, { id }, { user }) => {
      return isUserAdmin(user)
        ? getCommentById(id)
        : getQueryErrorResponse({
            props: { id: '', uid: '' },
            message: 'you must be logged in to get user information',
          });
    },
    users: (_, __, { user }) => {
      return isUserAdmin(user)
        ? getUsers()
        : [
            getQueryErrorResponse({
              props: { id: '', uid: '' },
              message: 'you must be logged in to get user information',
            }),
          ];
    },
    user: (_, { id }, { user }) => {
      return isUserAdmin(user)
        ? getUserById(id)
        : getQueryErrorResponse({
            props: { id: '', uid: '' },
            message: 'you must be logged in to get user information',
          });
    },
    whoAmI: async (_, __, { user }) => {
      return isUserMember(user)
        ? getUserById(user.userName)
        : getQueryErrorResponse({
            props: { id: '', uid: '' },
            message: 'you must be logged in as an admin',
          });
    },
  },
  Mutation: {
    createBoard: async (_, { input }, { user }) => {
      return isUserEditor(user)
        ? createBoard(input)
        : getMutationErrorResponse(
            'you must be editor or admin to create a board'
          );
    },
    updateBoard: async (_, { input }, { user }) => {
      return isUserEditor(user)
        ? updateBoard(input)
        : getMutationErrorResponse(
            'you must be editor or admin to update a board'
          );
    },
    createColumn: async (_, { input }, { user }) => {
      return isUserEditor(user)
        ? createColumn(input)
        : getMutationErrorResponse('you must be an editor to create a column');
    },
    updateColumn: async (_, { input }, { user }) => {
      return isUserEditor(user) && isUserMemberOfBoard(user, input.boardId)
        ? updateColumn(input)
        : getMutationErrorResponse('you must be an editor to create a column');
    },
    createComment: async (_, { input }, { user }) => {
      return (isUserMember(user) && isUserMemberOfBoard(user, input.boardId)) ||
        isUserAdmin(user)
        ? createComment(input, user.userName)
        : getMutationErrorResponse(
            'you can only comment on boards where you are a member'
          );
    },
    updateComment: async (_, { input }, { user }) => {
      const isAdmin = isUserAdmin(user);
      return isUserMember(user)
        ? updateComment(input, user.userName, isAdmin)
        : getMutationErrorResponse(
            'you can only comment on boards where you are a member'
          );
    },
    deleteComment: async (_, { input }, { user }) => {
      return isUserMember(user)
        ? deleteComment(input.id, user.userName, isUserAdmin(user))
        : getMutationErrorResponse(
            'User must be logged in to delete a comment'
          );
    },
    likeComment: async (_, { input }, { user }) => {
      return isUserMember(user) && isUserMemberOfBoard(user, input.boardId)
        ? likeComment(input, user.userName)
        : getMutationErrorResponse(
            'you can only like comments on boards where you are a member'
          );
    },
    unlikeComment: async (_, { input }, { user }) => {
      return isUserMember(user) && isUserMemberOfBoard(user, input.boardId)
        ? unlikeComment(input, user.userName)
        : getMutationErrorResponse(
            'you can only unlike comments on boards where you are a member'
          );
    },
    createUser,
    deleteUser,
    signup,
    login,
  },
  Board: {
    // following are unnecessary, but included for clarity
    name: ({ name }) => name,
    desc: ({ desc }) => desc,
    id: ({ id }) => id,
    columnIds: ({ columnIds }) => columnIds,
    userNames: ({ userNames }) => userNames,
    maxLikes: ({ maxLikes }) => maxLikes,
    // These are necessary
    users: async ({ id }) => {
      return await getUsersByBoardId(id);
    },
    columns: async ({ id }) => getColumnsByBoardId(id),
    comments: async ({ id }) => getCommentsByBoardId(id),
  },
  Column: {
    comments: async ({ id }) => getCommentsByColumnId(id),
  },
  Comment: {
    user: async ({ userName }) => {
      return getUserById(userName);
    },
  },
  User: {
    id: (root) => root.id,
    userName: (root) => root.id, // the userName is the id
    boards: async ({ id }) => getBoardsByUserName(id),
    comments: async ({ id }) => getCommentsByUserId(id),
  },
  MutationResponse: {
    __resolveType(obj, context, info) {
      return null;
    },
  },
};
