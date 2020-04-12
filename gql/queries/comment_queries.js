/**
 * Comment Queries
 */
const {
  getCollection,
  getByIdFromCollection,
} = require('../../helpers/gql_helpers');

const errorMsg = [
  {
    message: 'you must be logged in',
    code: '400',
    success: false,
  },
];

exports.getComments = async (_, __, user) => {
  if (!user.roles) {
    return errorMsg;
  }
  try {
    const comments = await getCollection('comments');
    return comments.docs.map((comment) => {
      return {
        ...comment.data(),
        id: comment.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getComment = async (_, { id }, user) => {
  if (!user.roles) {
    return errorMsg;
  }
  try {
    const comment = await getByIdFromCollection(id, 'comments');
    return {
      ...comment.data(),
      id,
    };
  } catch (error) {
    console.log(error);
  }
};

exports.getCommentUser = async (comment, _, user) => {
  if (!user.roles) {
    return {
      message: 'you must be logged in to see who authored a comment',
      code: '400',
      success: false,
    };
  }
  try {
    const commentUser = await getByIdFromCollection(comment.userId, 'users');
    if (commentUser.data) {
      return {
        ...commentUser.data(),
        id: comment.userId,
      };
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
