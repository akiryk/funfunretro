// TODO: remove this
exports.getErrorResponse = (
  message = 'Uh oh, there was a problem',
  code = '400'
) => ({
  message,
  code,
  success: false,
});

exports.getMutationErrorResponse = (
  message = 'Uh oh, there was a problem',
  code = '400'
) => ({
  message,
  code,
  success: false,
});

exports.getSuccessResponse = (message = 'Yes, it worked') => ({
  message,
  code: '200',
  success: true,
});

exports.getQueryErrorResponse = ({ props = {}, message, code }) => {
  return {
    ...props,
    response: this.getErrorResponse(message, code),
  };
};

/**
 * Return board data from a board query snapshot
 *
 * @param {object} board - the board querySnapshot
 * @returns {object} the board data in shape required by schema
 */
exports.getBoardData = (board) => {
  return {
    ...board.data(),
    id: board.id,
  };
};

/**
 * Helper functions for queries and mutations
 */
const { db } = require('./app_config');

/**
 * Get a collection of items from db
 *
 * @param {string} collection - the name of the collection, e.g. 'boards'
 * @return {object} querySnapshot object from firestore
 */
exports.getCollection = (collection) => db.collection(collection).get();

/**
 * Get a  single item by id from a collection
 *
 * @param {string} id - the firestore id
 * @param {string} collection - the name of the collection, e.g. 'boards'
 * @return {object} querySnapshot object from firestore
 */
exports.getByIdFromCollection = (id, collection) =>
  db.collection(collection).doc(id).get();

/**
 * Get the items from a collection that match a particular property
 * e.g. collection('users').where('userName', '==', 'akiryk')
 *
 * @param {string} collection - the database table
 * @param {string} targetProp - name of the property, e.g. userName
 * @param {string} matches - the matcher, e.g. '=='
 * @param {string} sourceProp - name of the property to match, e.g. board.id
 * @return {object} querySnapshot object from firestore
 */
exports.getFromCollectionWhere = ({
  collection,
  targetProp,
  matches,
  sourceProp,
}) => db.collection(collection).where(targetProp, matches, sourceProp).get();

exports.getDocFromCollection = (doc, collection) =>
  db.collection(collection).doc(doc).get();
