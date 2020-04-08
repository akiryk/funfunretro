/**
 * Helper functions for queries and mutations
 */
const { db } = require('../utils/admin');

/**
 * Get a collection of items from db
 *
 * @param {string} collection - the name of the collection, e.g. 'boards'
 * @return {object} querySnapshot object from firestore
 */
exports.getCollection = (collection) => db.collection(collection).get();

/**
 * Get a a single item by id from a collection
 *
 * @param {string} id - the firestore id
 * @param {string} collection - the name of the collection, e.g. 'boards'
 * @return {object} querySnapshot object from firestore
 */
exports.getByIdFromCollection = (id, collection) =>
  db.collection(collection).doc(id).get();
