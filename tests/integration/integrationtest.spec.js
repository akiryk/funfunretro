const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs } = require('../../gql/schema');
const resolvers = require('../../gql/resolvers');

jest.mock('../../utils/firebase', () => {
  const { mockFireBase } = require('../mockFireBase/mockFireBase');
  return mockFireBase;
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// use the test server to create a query function
const { query, mutate } = createTestClient(server);

xit('gets columns with a query', async () => {
  const GET_COLUMNS = gql`
    query getColumns {
      columns {
        name
      }
    }
  `;

  const res = await query({ query: GET_COLUMNS });
  expect(res.data.columns).toHaveLength(4);
});

fit('gets boards with a query', async () => {
  const GET_BOARDS = gql`
    query getBoards {
      boards {
        name
        columns {
          name
        }
      }
    }
  `;

  const res = await query({ query: GET_BOARDS });
  expect(res.data.boards).toHaveLength(2);
});
