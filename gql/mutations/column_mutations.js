/**
 * Column Mutations
 */
const { db, admin } = require('../../utils/firebase');

exports.createColumn = async (_, { input: args }) => {
  try {
    const newColumn = await admin.firestore().collection('columns').add({
      name: args.name,
      boardId: args.boardId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return {
      code: '200',
      success: true,
      message: `Successfully created a new column, ${args.name}`,
      column: {
        name: args.name,
        id: newColumn.id,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      code: '400',
      success: false,
      message: 'Unable to create a new column',
    };
  }
};

exports.updateColumn = async (_, { input: args }) => {
  const columnId = args.id;
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
    const name = args.name.trim();
    if (name === '') {
      return {
        code: '400',
        success: false,
        message: `Name field must not be empty`,
      };
    }
    const oldDoc = doc.data();
    const newDoc = {
      ...oldDoc,
      name,
      id: doc.id,
    };
    await columnToUpdate.update({ name });
    return {
      code: '200',
      success: true,
      message: `Successfully updated column ${columnId}`,
      column: {
        ...newDoc,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      code: '400',
      success: false,
      message: 'Unable to update the new column',
    };
  }
};

exports.deleteColumn = async (_, { input: args }) => {
  if (!args || !args.id) {
    return {
      message: "It looks like you didn't provide a column id",
      code: '400',
      success: false,
    };
  }

  // Find and delete the column
  const columnId = args.id;
  const columnToDelete = db.doc(`/columns/${columnId}`);
  try {
    const columnDoc = await columnToDelete.get();
    if (!columnDoc.exists) {
      return {
        code: '400',
        success: false,
        message: `column with id ${columnId} does not exist`,
      };
    }
    await columnToDelete.delete();

    // Find and delete all comments that were in the column
    const columnComments = await admin
      .firestore()
      .collection('comments')
      .where('columnId', '==', columnId)
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
    console.log(error);
    return {
      code: '400',
      success: false,
      message: 'Unable to delete the column',
    };
  }
};
