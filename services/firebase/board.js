/**
 * Firestore Board Service
 *
 * Get and Change Boards
 *
 */
const { db, admin } = require('./utils/app_config');
const {
  getErrorResponse,
  getSuccessResponse,
  getBoardData,
  getCollection,
  getByIdFromCollection,
  getFromCollectionWhere,
} = require('./utils/firestore_helpers');

/*
 * Get Boards
 * Permissions: Only Admins can view all boards
 */
exports.getBoards = async () => {
  try {
    const boards = await getCollection('boards');
    return boards.docs.map(getBoardData);
  } catch (err) {
    console.log(err);
    return {
      id: '',
      response: getErrorResponse(err, '500'),
    };
  }
};

/*
 * Get Board By Id
 * Permissions: Only members, editors, admin, can view a board by id
 */
exports.getBoardById = async (id) => {
  try {
    const board = await getByIdFromCollection(id, 'boards');
    return {
      ...board.data(),
      id,
    };
  } catch (error) {
    console.log(error);
    return {
      id: '',
      response: {
        message: error,
        code: '500',
        success: false,
      },
    };
  }
};

/*
 * Get boards for a given user
 */
exports.getBoardsByUserName = async (userName) => {
  try {
    const boards = await getFromCollectionWhere({
      collection: 'boards',
      targetProp: 'userNames',
      matches: 'array-contains',
      sourceProp: userName,
    });
    return boards.docs.map((board) => {
      return {
        ...board.data(),
        id: board.id,
        response: getSuccessResponse(),
      };
    });
  } catch (err) {
    console.log(err);
    return [
      {
        id: '',
        response: getErrorResponse('Server problem getting my boards', '500'),
      },
    ];
  }
};

/*
 * Create Board Mutation
 *
 * @param {object} board - the board, not used by this function
 * @param {object} args - the arguments passed to the mutation's input
 * @param {object} user - the logged in user
 */
exports.createBoard = async (newBoardData) => {
  let newBoard;
  const {
    name,
    desc = 'An amazing fun fun board!',
    maxLikes = 5,
    userNames = [],
  } = newBoardData;
  try {
    newBoard = await db.collection('boards').add({
      name,
      desc,
      maxLikes,
      userNames,
      likesByUser: {},
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
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

exports.updateBoard = async (input) => {
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

/**
 * TODO Come back to this. Disallow deleting boards and columns for now
 * read more here: https://firebase.google.com/docs/firestore/solutions/delete-collections
 *
 */
// exports.deleteBoard = async (input) => {
//   const { id: boardId } = input;
//   // delete the columns associated with this board
//   try {
//     const boardColumns = await db
//       .collection('columns')
//       .where('boardId', '==', boardId)
//       .get();

//     Promise.all(
//       boardColumns.docs.map(async (column) => {
//         console.log('COLUMN to delete', column.);
//         await column.delete();
//       })
//     );
//     return getSuccessResponse(`Board and columns deleted`);
//   } catch (error) {
//     return getErrorResponse(`unable to delete columns associated with board`);
//   }
//   try {
//     const boardRef = db.doc(`boards/${id}`);
//     const boardDoc = await boardRef.get();
//     if (!boardDoc.exists) {
//       return getErrorResponse(
//         `Cannot delete because that board does not exist`
//       );
//     }
//     await boardRef.delete();
//     return getSuccessResponse(`Board ${id} deleted successfully`);
//   } catch (error) {
//     return getErrorResponse(error);
//   }
// };
