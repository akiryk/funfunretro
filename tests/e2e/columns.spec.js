/**
 * Graphql Spec for Columns
 *
 * NOTE: REQUIRES LOCAL SERVER TO WORK
 */

const { graphQLClient } = require('./client');
const gql = require('graphql-tag');

const getColumnsQuery = gql`
  query Columns {
    columns {
      name
    }
  }
`;

const getColumnQuery = gql`
  query Column {
    column(id: "2fL16pRK4LZc6sQWSFcm") {
      name
    }
  }
`;

const getColumns = async () => {
  const {
    data: { columns },
  } = await graphQLClient.query({
    query: getColumnsQuery,
  });
  return columns;
};

const getColumn = async (id) => {
  const {
    data: { column },
  } = await graphQLClient.query({
    query: getColumnQuery,
  });
  return column;
};

describe('Column queries', () => {
  it('retrieve all columns', async () => {
    const columnsList = await getColumns();
    expect(columnsList.length).toBeGreaterThan(3);
  });

  it('retrieves a single column', async () => {
    const column = await getColumn('07hqwKZjcMoPwagAmgfi');
    expect(column.name).toEqual(expect.anything());
  });
});
