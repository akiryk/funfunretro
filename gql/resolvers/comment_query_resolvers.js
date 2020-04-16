/**
 * Comment Queries
 */
const {
  getCollection,
  getByIdFromCollection,
} = require('../../helpers/gql_helpers');
const { isMember } = require('../../helpers/resolver_helpers');

const permissionsErrorMessage = [
  {
    id: '',
    error: {
      message: 'you must be logged in',
      code: '400',
      success: false,
    },
  },
];

exports.getComments = async (_, __, user) => {
  if (!isMember(user)) {
    return permissionsErrorMessage;
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
  if (!isMember(user)) {
    return permissionsErrorMessage;
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
  if (!isMember(user)) {
    return permissionsErrorMessage;
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
