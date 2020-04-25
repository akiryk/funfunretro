const {
  isUserMemberOfBoard,
  getMutationErrorResponse,
} = require('../../firebase/utils/firestore_helpers');
const { isUserEditor } = require('../../firebase/utils/auth_helpers');

const {
  createColumn: createCol,
  updateColumn: updateCol,
  deleteColumn: deleteCol,
} = require('../../firebase/column');

const createColumn = async (_, { input }, { user }) => {
  return isUserEditor(user)
    ? createCol(input)
    : getMutationErrorResponse('you must be an editor to create a column');
};
const updateColumn = async (_, { input }, { user }) => {
  return isUserEditor(user) && isUserMemberOfBoard(user, input.boardId)
    ? updateCol(input)
    : getMutationErrorResponse('you must be an editor to create a column');
};

const deleteColumn = async (_, { input }, { user }) => {
  return isUserEditor(user) && isUserMemberOfBoard(user, input.boardId)
    ? deleteCol(input)
    : getMutationErrorResponse('you must be an editor to create a column');
};

module.exports = { createColumn, updateColumn };
