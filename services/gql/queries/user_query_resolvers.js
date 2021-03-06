const {
  isUserAdmin,
  isUserMember,
} = require('../../firebase/utils/auth_helpers');
const {
  getQueryErrorResponse,
} = require('../../firebase/utils/firestore_helpers');

const {
  getUsers,
  getUserById, // get user by userName (id === userName)
} = require('../../firebase/user');

const Board = require('../../firebase/Board')
const Comment = require('../../firebase/Comment');

const users = (_, __, { user }) => {
  return isUserAdmin(user)
    ? getUsers()
    : [
      getQueryErrorResponse({
        props: { id: '', uid: '' },
        message: 'you must be logged in to get user information',
      }),
    ];
};

const user = (_, { id }, { user, loaders }) => {
  const { usersLoader } = loaders;
  return isUserAdmin(user)
    ? usersLoader.load(id)
    : getQueryErrorResponse({
      props: { id: '', uid: '' },
      message: 'you must be logged in to get user information',
    });
};

const me = async (_, __, { user }) => {
  if (isUserMember(user)) {
    try {
      const userProfile = await getUserById(user.userName);
      return {
        ...userProfile,
        id: user.userName,
        role: user.role,
      };
    } catch (errorMessage) {
      return getQueryErrorResponse({
        code: 500,
        message: errorMessage,
      });
    }
  }
  return getQueryErrorResponse({
    code: 400,
    message: 'you must be logged in as a member',
  });
};

const userChildQueries = {
  id: (root) => root.id,
  boards: async ({ id }, _, { user }) => {
    if (isUserAdmin(user)) {
      // only admins are allowed to get information about any arbitrary user
      return Board.getBoardsByUserId(id);
    }
    // for other users, only give them information about their own boards
    return Board.getBoardsByUserId(user.userName)
  },
  comments: async ({ id }, _, { user }) => {
    if (isUserAdmin(user)) {
      // only admins are allowed to get information about any arbitrary user
      return Comment.getCommentsByUserId(id)
    }
    // for other users, only give them information about their own comments
    return Comment.getCommentsByUserId(user.userName)
  },
};

module.exports = { user, users, me, userChildQueries };
