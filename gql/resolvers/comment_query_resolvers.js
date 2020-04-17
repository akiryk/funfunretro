/**
 * Comment Queries
 */
const {
  getCollection,
  getByIdFromCollection,
} = require('../../helpers/gql_helpers');
const { isMember, isAdmin } = require('../../helpers/resolver_helpers');

const permissionsErrorMessage = [
  {
    id: '',
    response: {
      message: 'you must be an admin to get comment info on its own',
      code: '400',
      success: false,
    },
  },
];

exports.getComments = async (_, __, user) => {
  if (!isAdmin(user)) {
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
  if (!isAdmin(user)) {
    return {
      id: '',
      response: {
        message: 'you must be an admin to get comment info on its own',
        code: '400',
        success: false,
      },
    };
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
    // a user's userName is their user ID. They have a separate uid for authentication
    const commentUser = await getByIdFromCollection(comment.userName, 'users');
    if (commentUser.data) {
      return {
        ...commentUser.data(),
        id: comment.userName,
      };
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
