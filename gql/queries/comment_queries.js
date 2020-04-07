/**
 * Comment Queries
 */
const { getCollection, getByIdFromCollection } = require('../gql_helpers');

exports.getComments = async () => {
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

exports.getComment = async (_, { id }) => {
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

exports.getCommentUser = async (comment) => {
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
