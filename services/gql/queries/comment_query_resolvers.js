const {
  getQueryErrorResponse,
} = require('../../firebase/utils/firestore_helpers');

const { isUserAdmin } = require('../../firebase/utils/auth_helpers');

const { getComments, getCommentById } = require('../../firebase/comment');
const comments = async (_, __, { user }) => {
  return isUserAdmin(user)
    ? getComments()
    : [
        getQueryErrorResponse({
          props: { id: '' },
          message: 'you must be logged in as an admin',
        }),
      ];
};

const comment = (_, { id }, { user }) => {
  return isUserAdmin(user)
    ? getCommentById(id)
    : getQueryErrorResponse({
        props: { id: '', uid: '' },
        message: 'you must be logged in to get user information',
      });
};

const commentChildQueries = {
  user: async ({ createdBy }, _, { loaders }) => {
    const { usersByUserIdLoader } = loaders;
    return await usersByUserIdLoader.load(createdBy);
  },
};

module.exports = { comments, comment, commentChildQueries };
