/**
 * Helper functions for queries and mutations
 */
const { db } = require('../utils/firebase');

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
