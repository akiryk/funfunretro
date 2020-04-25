const {
  createBoard: createBoardService,
  updateBoard: updateBoardService,
} = require('../../firebase/board');
const { isUserEditor } = require('../../firebase/utils/auth_helpers');
const {
  getMutationErrorResponse,
} = require('../../firebase/utils/firestore_helpers');

const createBoard = async (_, { input }, { user }) => {
  return isUserEditor(user)
    ? createBoardService(input)
    : getMutationErrorResponse('you must be editor or admin to create a board');
};
const updateBoard = async (_, { input }, { user }) => {
  return isUserEditor(user)
    ? updateBoardService(input)
    : getMutationErrorResponse('you must be editor or admin to update a board');
};

module.exports = { createBoard, updateBoard };
