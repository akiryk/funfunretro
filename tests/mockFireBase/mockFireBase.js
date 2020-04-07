/**
 * Mock Firebase
 */
const { mockBoardsData, mockColumnsData } = require('../mocks/mockData');

const mockGet = (collection) =>
  jest.fn().mockImplementation(() => {
    switch (collection) {
      case 'boards':
        return Promise.resolve(mockBoardsData);
      case 'columns':
        return Promise.resolve(mockColumnsData);
    }
  });

exports.mockFireBase = {
  admin: {
    firestore: () => ({
      collection: (collection) => {
        return {
          get: () => mockGet(collection),
          where: jest.fn().mockImplementation(() => {
            return {
              get: jest.fn().mockImplementation(() => {
                return Promise.resolve(mockColumnsData);
              }),
            };
          }),
        };
      },
    }),
  },
  db: {
    collection: (collection) => {
      return {
        get: jest.fn().mockImplementation(() => {
          switch (collection) {
            case 'boards':
              return Promise.resolve(mockBoardsData);
            case 'columns':
              return Promise.resolve(mockColumnsData);
          }
        }),
      };
    },
  },
};
