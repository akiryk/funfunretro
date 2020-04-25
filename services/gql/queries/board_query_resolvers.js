const {
  isUserMember,
  isUserAdmin,
} = require('../../firebase/utils/auth_helpers');

const {
  isUserMemberOfBoard,
  getQueryErrorResponse,
} = require('../../firebase/utils/firestore_helpers');

const {
  getBoards,
  getBoardById,
  getBoardsByUserId,
} = require('../../firebase/board');

const {
  getColumnsByBoardId, // the columns that belong to a particular board
} = require('../../firebase/column');

const boards = async (_, __, { user }) => {
  return isUserAdmin(user)
    ? getBoards()
    : [
        getQueryErrorResponse({
          props: { id: '' },
          message: 'you must be logged in as an admin',
        }),
      ];
};

const board = async (_, { id }, { user }) => {
  if (isUserMemberOfBoard(user, id) || isUserAdmin(user)) {
    return getBoardById(id);
  }
  return getQueryErrorResponse({
    props: { id: '' },
    message: !isUserMember(user)
      ? 'you must be logged in'
      : 'you can not request boards to which you do not belong',
  });
};

const myBoards = async (_, __, { user }) => {
  return isUserMember(user)
    ? getBoardsByUserId(user.userName)
    : [
        getQueryErrorResponse({
          props: { id: '' },
          message: 'you must be logged in',
        }),
      ];
};

const boardChildQueries = {
  users: async ({ id }, _, { loaders }) => {
    const { usersByBoardIdLoader } = loaders;
    return await usersByBoardIdLoader.load(id);
  },
  columns: async ({ id }) => getColumnsByBoardId(id),
  likesByUser: ({ likesByUser = [] }) =>
    // return an array of arrays rather than of objects to align with schema
    Object.keys(likesByUser).map((userName) => [
      userName,
      `${likesByUser[userName]}`,
    ]),
};

module.exports = { boards, board, myBoards, boardChildQueries };
