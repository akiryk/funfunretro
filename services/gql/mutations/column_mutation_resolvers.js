const {
  getMutationErrorResponse,
} = require('../../firebase/utils/firestore_helpers');
const {
  isUserEditor,
  isUserAdmin,
} = require('../../firebase/utils/auth_helpers');
const { getUserById } = require('../../firebase/user');

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
  if (!isUserEditor(user)) {
    return {
      response: {
        message: 'You must be logged in with editor privileges',
        code: '400',
        success: false,
      },
    };
  }

  const { id: columnId, boardId, name } = input;

  if (isUserAdmin(user)) {
    return updateCol(columnId, name);
  }

  const userProfile = await getUserById(user.userName);
  return userProfile.boardIds.includes(boardId)
    ? updateCol(columnId, name)
    : {
        response: {
          message: 'You must belong to a board in order to change its columns',
          code: '400',
          success: false,
        },
      };
};

const deleteColumn = async (_, { input }, { user }) => {
  if (!isUserEditor(user)) {
    return {
      message: 'You must be logged in with editor privileges',
      code: '400',
      success: false,
    };
  }

  const { id: columnId, boardId } = input;

  if (isUserAdmin(user)) {
    return deleteCol(columnId);
  }
  const userProfile = await getUserById(user.userName);
  return userProfile.boardIds.includes(boardId)
    ? deleteCol(columnId)
    : {
        message: 'You must belong to a board in order to change its columns',
        code: '400',
        success: false,
      };
};

module.exports = { createColumn, updateColumn, deleteColumn };
