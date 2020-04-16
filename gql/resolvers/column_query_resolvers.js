/**
 * Column Queries
 */
const {
  getCollection,
  getByIdFromCollection,
  getFromCollectionWhere,
} = require('../../helpers/gql_helpers');
const { isAdmin } = require('../../helpers/resolver_helpers');

const errorMsg = {
  id: '',
  response: {
    message: 'you must be an Admin to get all the columns',
    code: '400',
    success: false,
  },
};

exports.getColumns = async (_, __, user) => {
  if (!isAdmin(user)) {
    return [errorMsg]; // needs to be an array
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
  if (!isAdmin(user)) {
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
  if (!isAdmin(user)) {
    return [errorMsg]; // needs to be an array
  }
  try {
    const columnComments = await getFromCollectionWhere({
      collection: 'comments',
      targetProp: 'columnId',
      matches: '==',
      sourceProp: column.id,
    });
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
