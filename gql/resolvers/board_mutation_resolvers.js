/**
 * Board Mutations
 */
const { db, admin } = require('../../utils/firebase');
const { EDITOR_ROLE, ADMIN_ROLE } = require('../../constants');

const errorMsg = {
  message: 'Editor privileges or above are required',
  code: '400',
  success: false,
};

/*
 * Create Board Mutation
 *
 * @param {object} board - the board, not used by this function
 * @param {object} args - the arguments passed to the mutation's input
 * @param {object} user - the logged in user
 */
exports.createBoard = async (_, { input: args }, user) => {
  if (
    !user.roles ||
    !user.roles.includes(ADMIN_ROLE) ||
    !user.roles.includes(EDITOR_ROLE)
  ) {
    return errorMsg;
  }
  try {
    const newBoard = await db.collection('boards').add({
      name: args.name,
      desc: args.desc,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userIds: [],
    });
    return {
      code: '200',
      success: true,
      message: `Successfully created a new board, ${args.name}, id:${newBoard.id}`,
      board: {
        name: args.name,
        desc: args.desc,
        id: newBoard.id,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      code: '400',
      success: false,
      message: 'Unable to create a new board',
    };
  }
};

exports.updateBoard = async (_, { input: args }, user) => {
  if (
    !user.roles ||
    !user.roles.includes(ADMIN_ROLE) ||
    !user.roles.includes(EDITOR_ROLE)
  ) {
    return errorMsg;
  }
  const boardId = args.id;
  try {
    const boardToUpdate = db.collection('boards').doc(boardId);
    const boardDoc = await boardToUpdate.get();
    if (!boardDoc.exists) {
      return {
        code: '400',
        success: false,
        message: `Board with id ${boardId} does not exist`,
      };
    }
    const updatedBoardData = {};
    if (args.name && args.name.trim() !== '') {
      updatedBoardData.name = args.name.trim();
    }
    if (args.desc && args.desc.trim() !== '') {
      updatedBoardData.desc = args.desc.trim();
    }
    if (Object.keys(updatedBoardData).length === 0) {
      return {
        code: '400',
        success: false,
        message: `No data was provided for an update`,
      };
    }
    await boardToUpdate.update({
      ...updatedBoardData,
    });
    const oldDoc = boardDoc.data();
    return {
      code: '200',
      success: true,
      message: `Successfully updated board ${boardId}`,
      board: {
        ...oldDoc,
        ...updatedBoardData,
        id: boardDoc.id,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      code: '400',
      success: false,
      message: 'Unable to update the board',
    };
  }
};
