/**
 * Comment Mutations
 */
const { admin, db } = require('../../utils/firebase');
const {
  getErrorResponse,
  getSuccessResponse,
} = require('../../helpers/resolver_helpers');
const { isMember, isAdmin } = require('../../helpers/resolver_helpers');

// createComment mutation takes an input type, so we need to destructure args from that
exports.createComment = async (_, { input }, user) => {
  const { userName, columnId, boardId, text } = input;

  // User must be logged in as a member at least in order to add a comment
  if (!isMember(user)) {
    return getErrorResponse('you must have member role to comment');
  }

  // The comment must have text
  const trimmedText = text.trim();
  if (trimmedText === '') {
    return getErrorResponse('Cannot leave text field empty');
  }

  // User must belong to a board in order to add a comment
  if (user.boardIds && user.boardIds.includes(boardId)) {
    try {
      const comment = {
        boardId,
        columnId,
        text,
        userName,
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
      console.log(error);
      return getErrorResponse(error);
    }
  } else {
    return getErrorResponse(
      'You must belong to a board in order to create a comment there'
    );
  }
};

// You must be the same commenter or be admin to change comment
exports.updateComment = async (_, { input }, user) => {
  const { id, text } = input;

  // the user.id is the user's userName
  // User must be logged in as a member at least in order to add a comment
  if (!isMember(user)) {
    return getErrorResponse('you must have member role to comment');
  }

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
    if (user.userName !== commentDoc.data().userName && !isAdmin(user)) {
      return getErrorResponse('A comment may only be edited by its author');
    }

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
  } catch (error) {
    console.log(error);
    return getErrorResponse(error);
  }
};

/**
 * Like a comment
 *
 * Users can like a comment multiple times with an optional limit on likes per board
 */
exports.likeComment = async (_, { input }, user) => {
  if (!isMember) {
    return getErrorResponse('You must be logged in');
  }

  // Get commentId and boardId from the input
  const { id: commentId, boardId } = input;

  // Get the userName, which is the user's id
  const userName = user.id;

  // User must belong to a board in order to like its comments
  if (user.boardIds && user.boardIds.includes(boardId)) {
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
      console.log(error);
      return getErrorResponse(error);
    }
  } else {
    return getErrorResponse(
      'You cannot like comments that are not on one of your boards'
    );
  }
};

/**
 * Unlike a comment
 *
 * Users can like a comment multiple times with an optional limit on likes per board
 * Unliking a comment means removing one of those likes from the comment.
 * Users cannot unlike a comment to which they haven't added any likes
 */
exports.unlikeComment = async (_, { input }, user) => {
  if (!isMember) {
    return getErrorResponse('You must be logged in');
  }

  // Get commentId and boardId from the input
  const { id: commentId, boardId } = input;
  // get the userName, which is the user's id

  // Get the userName, which is the user's id
  const userName = user.id;

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
    console.log(error);
    return getErrorResponse(error);
  }
};

exports.deleteComment = async (_, { input }, user) => {
  const { id } = input;

  const commentRef = db.doc(`/comments/${id}`);
  try {
    const commentDoc = await commentRef.get();

    // Return error if document doesn't exist
    // But only give info about existence of documents to logged in users
    if (!commentDoc.exists) {
      return getErrorResponse(`Comment with id ${id} does not exist`);
    }

    // User can only update their own comments (except for admins)
    if (user.userName !== commentDoc.data().userName && !isAdmin(user)) {
      return getErrorResponse('A comment may only be deleted by its author');
    }

    await commentRef.delete();
    return getSuccessResponse(`Comment ${id} deleted successfully`);
  } catch (error) {
    console.log(error);
    return getErrorResponse(error);
  }
};
