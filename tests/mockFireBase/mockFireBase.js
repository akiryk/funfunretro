/**
 * Mock Firebase
 */
const { mockDb } = require('../mocks/mockData');

const getCollection = (collection) => mockDb[collection];

exports.mockFireBase = {
  admin: {
    firestore() {
      return { collection: jest.fn(), where: jest.fn() };
    },
  },
  db: {
    collection: (collection) => {
      return {
        get: () => {
          const data = getCollection(collection);
          return Promise.resolve(data);
        },
        where: () => {
          const data = getCollection('columns');
          return Promise.resolve(data);
        },
        // get: jest.fn().mockImplementation(() => {
        //   const data = getCollection(collection);
        //   return Promise.resolve(data);
        // }),
        // where: jest.fn().mockImplementation((propA, matches, propB) => {
        //   console.log('PropA', matches);
        //   return;
        // }),
      };
    },
  },
};
