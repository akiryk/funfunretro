/**
 * Test Firestore Queries
 *
 * This ensures the logic of our calls to Firestore return data in the expected shape
 */

const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs } = require('../gql/schema');
const resolvers = require('../gql/resolvers');
const { mockFirebase } = require('firestore-jest-mock');
const { getCollection } = require('../helpers/gql_helpers');
const { getBoardData } = require('../helpers/resolver_helpers');
const {
  mockCollection,
  mockWhere,
} = require('firestore-jest-mock/mocks/firestore');
// Create a fake firestore with a `users` and `posts` collection
mockFirebase({
  database: {
    users: [
      { id: 'adam', email: 'email1@test.com', boardIds: ['AAAAA'] },
      { id: 'bill', email: 'email2@test.com', boardIds: ['AAAAA'] },
      { id: 'jim', email: 'email2@test.com', boardIds: ['BBBBB'] },
      { id: 'jane', email: 'email2@test.com', boardIds: ['BBBBB'] },
    ],
    boards: [
      {
        id: 'AAAAA',
        name: 'Board 1',
        userNames: ['adam', 'bill'],
      },
      {
        id: 'BBBBB',
        name: 'Board 2',
        userNames: ['jim', 'jame'],
      },
    ],
  },
});

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// use the test server to create a query function
// const { query, mutate } = createTestClient(server);

describe('getCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // const firebase = require('firebase'); // or import firebase from 'firebase';
  const admin = require('firebase-admin');
  const db = admin.firestore();

  it('returns a collection of boards', async () => {
    const boards = await db.collection('boards').get();
    const shapedData = boards.docs.map(getBoardData);
    expect(shapedData).toHaveLength(2);
    expect(shapedData).not.toHaveLength(3);
    expect(shapedData[0]).toHaveProperty('name');
  });

  it('returns a collection of my boards', async () => {
    const boards = await db
      .collection('boards')
      .where('name', '==', 'Board 1')
      .get();
    const shapedData = boards.docs.map(
      (board) => console.log(board.id) || { ...board.data() }
    );
    expect(mockWhere).toHaveBeenCalled();
    // expect(shapedData).toHaveLength(1);
    // expect(shapedData).not.toHaveLength(3);
    // expect(shapedData[0]['name']).toBe('Board 1');
  });
});
