/**
 * Firestore Column Service
 *
 * Get and change columns
 */
const { db, admin } = require('./utils/app_config');
const {
  getCollection,
  getByIdFromCollection,
  getFromCollectionWhere,
} = require('./utils/firestore_helpers');

exports.getColumns = async () => {
  try {
    const columns = await getCollection('columns');
    return columns.docs.map((column) => {
      return {
        ...column.data(),
        id: column.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getColumnById_ = async (id) => {
  try {
    const column = await getByIdFromCollection(id, 'columns');
    return {
      ...column.data(),
      id,
    };
  } catch (error) {
    console.log(error);
  }
};

exports.getColumnsByBoardId = async (boardId) => {
  try {
    const boardColumns = await getFromCollectionWhere({
      collection: 'columns',
      targetProp: 'boardId',
      matches: '==',
      sourceProp: boardId,
    });
    return boardColumns.docs.map((column) => {
      return {
        ...column.data(),
        id: column.id,
      };
    });
  } catch (error) {
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

exports.createColumn = async (input) => {
  const { name, boardId } = input;
  try {
    const newColumn = await admin.firestore().collection('columns').add({
      name: name,
      boardId: boardId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return {
      code: '200',
      success: true,
      message: `Successfully created a new column, ${name}`,
      column: {
        name: name,
        id: newColumn.id,
      },
    };
  } catch (error) {
    return {
      code: '400',
      success: false,
      message: 'Unable to create a new column',
    };
  }
};

// Editor role only
exports.updateColumn = async (input) => {
  const { id: columnId, name } = input;
  console.log('Got the id', input);
  try {
    const columnToUpdate = db.collection('columns').doc(columnId);
    const doc = await columnToUpdate.get();
    if (!doc.exists) {
      return {
        code: '400',
        success: false,
        message: `Column with id ${columnId} does not exist`,
      };
    }
    const trimmedName = name.trim();
    if (trimmedName === '') {
      return {
        code: '400',
        success: false,
        message: `Name field must not be empty`,
      };
    }
    const oldDoc = doc.data();
    const newDoc = {
      ...oldDoc,
      trimmedName,
      id: doc.id,
    };
    await columnToUpdate.update({ trimmedName });
    return {
      code: '200',
      success: true,
      message: `Successfully updated column ${columnId}`,
      column: {
        ...newDoc,
      },
    };
  } catch (error) {
    return {
      code: '400',
      success: false,
      message: 'Unable to update the new column',
    };
  }
};

/**
 * Delete a column
 * TODO: make this work. As of now it is only possible to hide a column
 *
 * - delete the column
 * - delete all comments on the column
 * - recalibrate likes for anyone who liked one of those comments
 */
exports.deleteColumn = async (id) => {
  const columnToDelete = db.doc(`/columns/${id}`);
  try {
    const columnDoc = await columnToDelete.get();
    if (!columnDoc.exists) {
      return {
        code: '400',
        success: false,
        message: `column with id ${id} does not exist`,
      };
    }
    await columnToDelete.delete();

    // Find and delete all comments that were in the column
    const columnComments = await admin
      .firestore()
      .collection('comments')
      .where('columnId', '==', id)
      .get();
    let deletedCommentCount = 0;
    columnComments.forEach(async (comment) => {
      const commentToDelete = db.doc(`/comments/${comment.id}`);
      ++deletedCommentCount;
      await commentToDelete.delete();
    });
    return {
      code: '400',
      success: false,
      message: `Column ${columnId} deleted successfully along with its ${deletedCommentCount} comments`,
    };
  } catch (error) {
    return {
      code: '400',
      success: false,
      message: 'Unable to delete the column',
    };
  }
};
