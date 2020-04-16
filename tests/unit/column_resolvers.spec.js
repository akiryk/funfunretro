const {
  getColumns,
  getColumn,
  getColumnComments,
} = require('../../gql/resolvers/column_query_resolvers');
const {
  getCollection,
  getByIdFromCollection,
  getFromCollectionWhere,
} = require('../../helpers/gql_helpers');

jest.mock('../../helpers/gql_helpers.js');

const mockBoard = {};
const mockArgs = {};
// logged in users will have a role property of 'MEMBER', 'EDITOR', or 'ADMIN'
const mockUserMember = {
  role: 'MEMBER',
};
const mockUserAdmin = {
  role: 'ADMIN',
};
const mockUserNonMember = {
  role: '',
};

describe('Column Resolvers', () => {
  describe('Get list of all columns', () => {
    it('gets all columns is user is an Admin', async () => {
      getCollection.mockImplementation(() => {
        return Promise.resolve({
          docs: [
            {
              data() {
                return {
                  name: 'Red Column',
                };
              },
              id: '111',
            },
            {
              data() {
                return {
                  name: 'Blue Column Column',
                };
              },
              id: '222',
            },
          ],
        });
      });
      const columns = await getColumns({}, {}, mockUserAdmin);
      expect(columns).toHaveLength(2);
      expect(columns).not.toHaveLength(4);
      expect(columns[0].name).toBe('Red Column');
    });
  });

  it('gets an error message if user is not admin', async () => {
    const columns = await getColumns({}, {}, mockUserMember);
    expect(columns[0].response.success).toBe(false);
    expect(columns[0].response.code).toBe('400');
    expect(columns[0].response).toHaveProperty('message');
  });

  describe('Get a column by ID', () => {
    it('gets a single column if user is an Admin', async () => {
      getByIdFromCollection.mockImplementation(() => {
        return Promise.resolve({
          data: () => ({
            name: 'some column',
          }),
        });
      });
      const column = await getColumn(null, { id: 'SOMEID' }, mockUserAdmin);
      expect(column['name']).toBe('some column');
      expect(column['id']).toBe('SOMEID');
    });
  });

  it('gets an error message if user is not admin', async () => {
    const column = await getColumn(null, { id: '111' }, mockUserMember);
    expect(column.response.success).toBe(false);
    expect(column.response.code).toBe('400');
    expect(column.response).toHaveProperty('message');
  });

  describe('Get a column comments by column ID', () => {
    it('gets a single column if user is an Admin', async () => {
      getFromCollectionWhere.mockImplementation(() => {
        return Promise.resolve({
          docs: [
            {
              data() {
                return {
                  columnId: 'ID111',
                  text: 'This is a great comment',
                  boardId: 'BoardID1111',
                  userId: 'akiryk',
                };
              },
              id: 'commentId1',
            },
            {
              data() {
                return {
                  columnId: 'ID222',
                  text: 'This is a lame comment',
                  boardId: 'BoardID222',
                  userId: 'jsmith',
                };
              },
              id: 'commentId2',
            },
          ],
        });
      });
      const comments = await getColumnComments(
        mockBoard,
        mockArgs,
        mockUserAdmin
      );
      expect(comments).toHaveLength(2);
      expect(comments).not.toHaveLength(4);
      expect(comments[0]).toHaveProperty('text');
      expect(comments[0]).toHaveProperty('userId');
      expect(comments[0]).toHaveProperty('id');
    });
  });

  it('gets an error message if user is not admin', async () => {
    const column = await getColumn(null, { id: '111' }, mockUserMember);
    expect(column.response.success).toBe(false);
    expect(column.response.code).toBe('400');
    expect(column.response).toHaveProperty('message');
  });
});
