const { db, admin } = require('./utils/app_config');
const {
  getErrorResponse,
  getSuccessResponse,
  getCollection,
  getFromCollectionWhere,
} = require('./utils/firestore_helpers');

module.exports = {
  getCommentById: async (id) => {
    try {
      const comment = await db.collection('comments').doc(id).get();
      return {
        ...comment.data(),
        id,
      };
    } catch (error) {
      return getErrorResponse(error);
    }
  },

  getComments: async () => {
    try {
      const comments = await getCollection('comments');
      return comments.docs.map((comment) => {
        return {
          ...comment.data(),
          id: comment.id,
        };
      });
    } catch (error) {
      return getErrorResponse(error);
    }
  },

  /**
   * Get comments by User Id/UserName userName == user.id
   */
  getCommentsByUserId: async (userName) => {
    try {
      const comments = await db
        .collection('comments')
        .where('createdBy', '==', userName)
        .get();
      const userComments = comments.docs.map((comment) => {
        return {
          ...comment.data(),
          id: comment.id,
        };
      });
      return userComments.length > 0
        ? userComments
        : [
          {
            response: {
              message: `Womp womp... ${userName} has no comments`,
              success: true,
              code: '200'
            }
          }
        ]
    } catch (error) {
      return getErrorResponse(error);
    }
  },

  getCommentsByBoardId: async (id) => {
    try {
      const boardComments = await getFromCollectionWhere({
        collection: 'comments',
        targetProp: 'boardId',
        matches: '==',
        sourceProp: id,
      });

      return boardComments.docs.map((comment) => {
        return {
          ...comment.data(),
          id: comment.id,
        };
      });
    } catch (error) {
      return [
        {
          id: '',
          response: {
            message: error,
            code: '500',
            success: false,
          },
        },
      ];
    }
  },

  getCommentsByColumnId: async (columnId) => {
    try {
      const comments = await getFromCollectionWhere({
        collection: 'comments',
        targetProp: 'columnId',
        matches: '==',
        sourceProp: columnId,
      });

      return comments.docs.map((comment) => {
        return {
          ...comment.data(),
          id: comment.id,
        };
      });
    } catch (error) {
      return [
        {
          id: '',
          response: {
            message: error,
            code: '500',
            success: false,
          },
        },
      ];
    }
  },

  // createComment mutation takes an input type, so we need to destructure args from that
  createComment: async (input, createdBy) => {
    const { columnId, boardId, text } = input;

    // The comment must have text
    const trimmedText = text.trim();
    if (trimmedText === '') {
      return getErrorResponse(error);
    }

    try {
      const comment = {
        boardId,
        columnId,
        text,
        createdBy,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      const newComment = await admin
        .firestore()
        .collection('comments')
        .add(comment);
      return {
        ...getSuccessResponse(`Successfully created a new comment`),
        comment: {
          ...comment,
          id: newComment.id,
        },
      };
    } catch (error) {
      return getErrorResponse(error);
    }
  },

  // You must be the same commenter or be admin to change comment
  updateComment: async (input, userName, isAdmin) => {
    const { id, text } = input;

    // The comment must have text
    const trimmedText = text.trim();
    if (trimmedText === '') {
      return getErrorResponse('Cannot leave text field empty');
    }

    try {
      const commentRef = db.doc(`comments/${id}`);
      const commentDoc = await commentRef.get();

      if (!commentDoc.exists) {
        return getErrorResponse(`Comment with id ${id} does not exist`);
      }
      // User can only update their own comments (except for admins)
      if (userName == commentDoc.data().createdBy || isAdmin) {
        await commentRef.update({ text });
        return {
          code: '200',
          success: true,
          message: `Successfully updated comment`,
          comment: {
            ...commentDoc.data(),
            text,
            id,
          },
        };
      } else {
        return getErrorResponse('A comment may only be edited by its author');
      }
    } catch (error) {
      console.log(error);
      return getErrorResponse(error);
    }
  },

  deleteComment: async (id, userName, isAdmin) => {
    try {
      const commentRef = db.doc(`/comments/${id}`);
      const commentDoc = await commentRef.get();

      // Return error if document doesn't exist
      // But only give info about existence of documents to logged in users
      if (!commentDoc.exists) {
        return getErrorResponse(`Comment with id ${id} does not exist`);
      }

      if (commentDoc.data().createdBy == userName || isAdmin) {
        await commentRef.delete();
        return getSuccessResponse(`Comment ${id} deleted successfully`);
      } else {
        return getErrorResponse(`You can only delete your own comments`);
      }
    } catch (error) {
      return getErrorResponse(error);
    }
  },

  /**
   * Like a comment
   *
   * Users can like a comment multiple times with an optional limit on likes per board
   */
  likeComment: async (input, userName) => {
    // Get commentId and boardId from the input
    const { id: commentId, boardId } = input;
    try {
      // get reference to the current board
      const boardRef = db.doc(`boards/${boardId}`);

      // get the actual board document, an async call
      const boardDoc = await boardRef.get();

      // likesByUser is a map with the number of likes made by each user on this board
      const { likesByUser = {}, maxLikes } = boardDoc.data();

      // userTotalLikes is the current user's total number of likes on this board
      const userTotalLikes = likesByUser[userName] || 0;

      // Don't let users like more times than is allowed, if there is a maxLike setting
      if (maxLikes && userTotalLikes >= maxLikes) {
        return {
          ...getErrorResponse(
            `You can only like ${maxLikes} ${
            maxLikes === 1 ? 'time' : 'times'
            } on a board`
          ),
          userTotalLikes,
        };
      }

      // Get the comment that's being liked
      const commentRef = db.doc(`comments/${commentId}`);
      const commentDoc = await commentRef.get();
      if (!commentDoc.exists) {
        return getErrorResponse(`Comment with id ${commentId} does not exist`);
      }

      // Grab a reference to an increment value from firestore
      const increment = admin.firestore.FieldValue.increment(1);

      // increment the likes on this comment
      await commentRef.update({ likes: increment });

      // we can reuse the same likesByUser map for updating both comments and boards
      const likes = {
        likesByUser: {
          [userName]: increment,
        },
      };

      // increment the user's total likes on the current comment
      commentRef.set(likes, { merge: true });

      // Increment the user's total likes the the current board
      boardRef.set(likes, { merge: true });

      return {
        ...getSuccessResponse('Successfully updated comment'),
        userTotalLikes: userTotalLikes + 1,
      };
    } catch (error) {
      return getErrorResponse(error);
    }
  },

  /**
   * Unlike a comment
   *
   * Users can like a comment multiple times with an optional limit on likes per board
   * Unliking a comment means removing one of those likes from the comment.
   * Users cannot unlike a comment to which they haven't added any likes
   */
  unlikeComment: async (input, userName) => {
    // Get commentId and boardId from the input
    const { id: commentId, boardId } = input;
    // get the userName, which is the user's id

    try {
      // get reference to the current board
      const boardRef = db.doc(`boards/${boardId}`);

      // get the actual board document, an async call
      const boardDoc = await boardRef.get();

      // likesByUser is a map with the number of likes made by each user on this board
      const { likesByUser = {} } = boardDoc.data();

      // userTotalLikes is the current user's total number of likes on this board
      const userTotalLikes = likesByUser[userName] || 0;

      // Get the comment that's being unliked
      const commentRef = db.doc(`comments/${commentId}`);
      const commentDoc = await commentRef.get();
      if (!commentDoc.exists) {
        return getErrorResponse(`Comment with id ${commentId} does not exist`);
      }

      // Don't let users unlike an item if they haven't already liked it
      if (!commentDoc.data().likesByUser[userName]) {
        return getErrorResponse(
          `Cannot unlike a comment that you have not already liked`
        );
      }

      // Grab a reference to a decrement value from firestore
      const decrement = admin.firestore.FieldValue.increment(-1);

      // decrement the likes on this comment
      await commentRef.update({ likes: decrement });

      // we can reuse the same likesByUser map for updating both comments and boards
      const likesPerUser = {
        likesByUser: {
          [userName]: decrement,
        },
      };

      // decrement the user's total likes per comment
      commentRef.set(likesPerUser, { merge: true });

      // decrement the user's total likes per board
      boardRef.set(likesPerUser, { merge: true });

      return {
        ...getSuccessResponse('Successfully updated comment'),
        userTotalLikes: userTotalLikes - 1,
      };
    } catch (error) {
      return getErrorResponse(error);
    }
  },
};
