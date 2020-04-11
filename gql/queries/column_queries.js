/**
 * Column Queries
 */
const {
  getCollection,
  getByIdFromCollection,
} = require('../../helpers/gql_helpers');
const { admin } = require('../../utils/firebase');

exports.getColumns = async () => {
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

exports.getColumn = async (_, { id }) => {
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

exports.getColumnComments = async (column) => {
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
