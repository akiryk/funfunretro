const {
  isUserMember,
  isUserAdmin,
} = require('../../firebase/utils/auth_helpers');

const {
  getQueryErrorResponse,
} = require('../../firebase/utils/firestore_helpers');

const Board = require('../../firebase/Board');

const { getUserById } = require('../../firebase/user');

const {
  getColumnsByBoardId, // the columns that belong to a particular board
} = require('../../firebase/column');

const boards = async (_, __, { user }) => {
  return isUserAdmin(user)
    ? Board.getBoards()
    : [
      getQueryErrorResponse({
        props: { id: '' },
        message: 'you must be logged in as an admin',
      }),
    ];
};

const board = async (_, { id: boardId }, { user }) => {
  if (isUserAdmin(user)) {
    return getBoardById(boardId);
  }
  const userProfile = await getUserById(user.userName);
  return userProfile.boardIds.includes(boardId)
    ? Board.getBoardById(boardId)
    : getQueryErrorResponse({
      props: { id: '' },
      message: !isUserMember(user)
        ? 'you must be logged in'
        : 'you can not request boards to which you do not belong',
    });
};

const myBoards = async (_, __, { user }) => {
  return isUserMember(user)
    ? Board.getBoardsByUserId(user.userName)
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
