/**
 * Comment Mutations
 */
const { admin, db } = require('../../utils/firebase');
const {
  getGenericMutationResponseForError,
} = require('../../helpers/resolver_helpers');
const { isMember, isAdmin } = require('../../helpers/resolver_helpers');

// createComment mutation takes an input type, so we need to destructure args from that
exports.createComment = async (_, { input: args }, user) => {
  if (!isMember(user)) {
    // only logged in users can see a board
    return {
      message: 'you must have member role to comment',
      code: '400',
      success: false,
    };
  }
  const text = args.text.trim();
  if (text === '') {
    return {
      code: '400',
      success: false,
      message: `Cannot leave text field empty`,
    };
  }
  try {
    const comment = {
      columnId: args.columnId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      text,
      userId: args.userId,
    };
    const newComment = await admin
      .firestore()
      .collection('comments')
      .add(comment);
    return {
      code: '200',
      success: true,
      message: `Successfully created a new comment`,
      comment: {
        ...comment,
        id: newComment.id,
      },
    };
  } catch (error) {
    console.log(error);
    return getGenericMutationResponseForError('create', 'comment');
  }
};

// You must be the same commenter or be admin to change comment
exports.updateComment = async (_, { input: args }, user) => {
  if (!isMember) {
    // only logged in users can see a board
    return {
      message: 'you must have member role to comment',
      code: '400',
      success: false,
    };
  }

  const commentId = args.id;
  try {
    const commentToUpdate = db.collection('comments').doc(commentId);
    const doc = await commentToUpdate.get();
    if (!doc.exists) {
      return {
        code: '400',
        success: false,
        message: `Comment with id ${commentId} does not exist`,
      };
    }
    const text = args.text.trim();
    if (text === '') {
      return {
        code: '400',
        success: false,
        message: `No text was provided for an update`,
      };
    }
    const oldDoc = doc.data();
    if (oldDoc.userId !== user.userName) {
      return {
        code: '400',
        success: false,
        message: `Only the creator of a comment or an admin may edit the comment`,
      };
    }
    const newDoc = {
      ...oldDoc,
      text,
      id: doc.id,
    };
    await commentToUpdate.update({ text });
    return {
      code: '200',
      success: true,
      message: `Successfully updated comment`,
      comment: {
        ...newDoc,
      },
    };
  } catch (error) {
    console.log(error);
    return getGenericMutationResponseForError('update', 'comment');
  }
};

exports.deleteComment = async (_, { input: args }, user) => {
  if (!args || !args.id) {
    return {
      code: '400',
      success: false,
      message: "It looks like you didn't provide a comment id",
    };
  }
  const commentToDelete = db.doc(`/comments/${args.id}`);
  try {
    const commentDoc = await commentToDelete.get();

    // Return error if document doesn't exist
    // But only give info about existence of documents to logged in users
    if (isMember(user) && !commentDoc.exists) {
      return {
        code: '400',
        success: false,
        message: `comment does not exist with id ${args.id}`,
      };
    }
    if (commentDoc.data().userId === user.userName || isAdmin(user)) {
      await commentToDelete.delete();
      return {
        code: '200',
        success: true,
        message: `Comment ${args.id} deleted successfully`,
      };
    } else {
      return {
        message: 'insufficient privileges to delete comment',
        code: '400',
        success: false,
      };
    }
  } catch (error) {
    console.log(error);
    return getGenericMutationResponseForError('delete', 'comment');
  }
};
