const {
  getQueryErrorResponse,
} = require('../../firebase/utils/firestore_helpers');

const { isUserAdmin } = require('../../firebase/utils/auth_helpers');

const Comment = require('../../firebase/Comment');

const comments = async (_, __, { user }) => {
  return isUserAdmin(user)
    ? Comment.getComments()
    : [
        getQueryErrorResponse({
          props: { id: '' },
          message: 'you must be logged in as an admin',
        }),
      ];
};

const comment = (_, { id }, { user }) => {
  return isUserAdmin(user)
    ? Comment.getCommentById(id)
    : getQueryErrorResponse({
        props: { id: '', uid: '' },
        message:
          'you must be logged in as an admin to get specific comment information',
      });
};

const commentChildQueries = {
  user: async ({ createdBy }, _, { loaders }) => {
    const { usersByUserIdLoader } = loaders;
    return await usersByUserIdLoader.load(createdBy);
  },
};

module.exports = { comments, comment, commentChildQueries };
