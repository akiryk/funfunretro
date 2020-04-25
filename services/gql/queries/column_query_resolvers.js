const { isUserAdmin } = require('../../firebase/utils/auth_helpers');
const {
  getQueryErrorResponse,
} = require('../../firebase/utils/firestore_helpers');
const Comment = require('../../firebase/Comment');
const { getColumns, getColumnById } = require('../../firebase/column');

const columns = async (_, __, { user }) => {
  return isUserAdmin(user)
    ? getColumns()
    : [
        getQueryErrorResponse({
          props: { id: '' },
          message: 'you must be logged in as an admin for that',
        }),
      ];
};

const column = async (_, { id }, { user }) => {
  return isUserAdmin(user)
    ? getColumnById(id, user.role)
    : getQueryErrorResponse({
        props: { id: '' },
        message: 'you must be logged in as an admin',
      });
};

const columnChildQueries = {
  comments: async ({ id }) => Comment.getCommentsByColumnId(id),
};

module.exports = { column, columns, columnChildQueries };
