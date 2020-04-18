/**
 * Board Mutations
 */
const { db, admin } = require('../../utils/firebase');
const { isMember, isEditor } = require('../../helpers/resolver_helpers');
const {
  getErrorResponse,
  getSuccessResponse,
} = require('../../helpers/resolver_helpers');

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
exports.createBoard = async (_, { input }, user) => {
  if (!isEditor(user)) {
    return getErrorResponse('you must be editor or admin to create a board');
  }

  const {
    name,
    desc = 'An amazing fun fun board!',
    maxLikes = 5,
    userNames = [],
  } = input;

  try {
    await db.collection('boards').add({
      name,
      desc,
      maxLikes,
      userNames,
      likesByUser: {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
    return getErrorResponse('Unable to create a new board');
  }
  return {
    code: '200',
    success: true,
    message: `Successfully created a new board`,
    board: {
      name,
      desc,
      maxLikes,
      userNames,
      id: newBoard.id,
    },
  };
};

exports.updateBoard = async (_, { input }, user) => {
  if (!isEditor(user)) {
    return getErrorResponse('you must be editor or admin to update a board');
  }

  const { name, desc, maxLikes, userNames, id } = input;

  try {
    const boardRef = db.doc(`boards/${id}`);
    const boardDoc = await boardRef.get();
    if (!boardDoc.exists) {
      return getErrorResponse(`Board with id ${boardId} does not exist`);
    }

    // Create an object that will contain all the updates
    const updatedBoardData = {};
    if (name && name.trim() !== '') {
      updatedBoardData.name = name.trim();
    }
    if (desc && desc.trim() !== '') {
      updatedBoardData.desc = desc.trim();
    }
    if (maxLikes) {
      updatedBoardData.maxLikes = maxLikes;
    }
    if (userNames && userNames.length > 0) {
      updatedBoardData.userNames = Array.from(
        new Set([...boardDoc.data().userNames, ...userNames])
      );
    }
    console.log('Nesms', updatedBoardData.userNames);
    if (Object.keys(updatedBoardData).length === 0) {
      return getErrorResponse(`No data was provided for an update`);
    }

    await boardRef.update({
      ...updatedBoardData,
    });

    const oldDoc = boardDoc.data();
    return {
      code: '200',
      success: true,
      message: `Successfully updated board ${id}`,
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
