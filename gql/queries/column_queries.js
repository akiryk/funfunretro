/**
 * Column Queries
 */
const {
  getCollection,
  getByIdFromCollection,
} = require('../../helpers/gql_helpers');
const { admin } = require('../../utils/firebase');

const errorMsg = [
  {
    message: 'you must be logged in',
    code: '400',
    success: false,
  },
];

exports.getColumns = async (_, __, user) => {
  if (!user.roles) {
    return errorMsg;
  }
  try {
    const columns = await getCollection('columns');
    return columns.docs.map((column) => {
      return {
        ...column.data(),
        id: column.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getColumn = async (_, { id }, user) => {
  if (!user.roles) {
    return errorMsg;
  }
  try {
    const column = await getByIdFromCollection(id, 'columns');
    return {
      ...column.data(),
      id,
    };
  } catch (error) {
    console.log(error);
  }
};

exports.getColumnComments = async (column, _, user) => {
  if (!user.roles) {
    return errorMsg;
  }
  try {
    const columnComments = await admin
      .firestore()
      .collection('comments')
      .where('columnId', '==', column.id)
      .get();
    return columnComments.docs.map((comment) => {
      return {
        ...comment.data(),
        id: comment.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};
