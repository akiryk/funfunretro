const {
  getBoards,
  getBoard,
  getBoardUsers,
  getBoardColumns,
  getBoardComments,
} = require('../../gql/resolvers/board_query_resolvers');
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
const mockUserNonMember = {
  role: '',
};

describe('Board Resolvers', () => {
  describe('Get list of all boards', () => {
    it('gets all boards', async () => {
      getCollection.mockImplementation(() => {
        return Promise.resolve({
          docs: [
            {
              data() {
                return {
                  name: 'first board',
                  desc: '',
                };
              },
              id: '111',
            },
            {
              data() {
                return true;
              },
              id: '222',
            },
          ],
        });
      });
      const boards = await getBoards();
      expect(boards).toHaveLength(2);
      expect(boards).not.toHaveLength(4);
      expect(boards[0].name).toBe('first board');
    });

    it('returns an error if it fails to retrieve boards from the database', async () => {
      getCollection.mockImplementation(() =>
        Promise.reject('something went wrong')
      );
      const board = await getBoards(null, {}, mockUserMember);
      expect(board.response.success).toBe(false);
      expect(board.response.message).toBe('something went wrong');
    });
  });

  describe('Get a board by ID', () => {
    it('gets a board by ID if requester is a logged in user', async () => {
      getByIdFromCollection.mockImplementation(() => {
        return Promise.resolve({
          data: () => ({
            name: 'new board',
            desc: '',
          }),
          id: '111',
        });
      });
      const board = await getBoard(null, { id: '111' }, mockUserMember);
      expect(board['name']).toBe('new board');
    });

    it('returns an error if user us not a logged in user', async () => {
      const board = await getBoard(null, { id: '111' }, mockUserNonMember);
      expect(board.response.success).toBe(false);
      expect(board.response.message).toBe(
        'you must be logged in to view a board'
      );
    });

    it('returns an error if no board id is provided as an argument', async () => {
      const board = await getBoard(null, {}, mockUserNonMember);
      expect(board.response.success).toBe(false);
      expect(board.response.code).toBe('400');
      expect(board.response).toHaveProperty('message');
    });

    it('returns an error if database returns any kind of error', async () => {
      getByIdFromCollection.mockImplementation(() =>
        Promise.reject('there was a problem getting board by id')
      );
      const board = await getBoard(null, { id: '123' }, mockUserMember);
      expect(board.response.success).toBe(false);
      expect(board.response.code).toBe('500');
      expect(board.response).toHaveProperty('message');
    });
  });

  it('gets a list of board users based on a board id', async () => {
    getFromCollectionWhere.mockImplementation(() => {
      return Promise.resolve({
        docs: [
          {
            data() {
              return {
                userName: 'Adam',
                email: 'adam@email.com',
                boardIds: [1],
                uid: '111111',
                role: 'ADMIN',
              };
            },
            id: 'aaaaaaaa',
          },
          {
            data() {
              return {
                userName: 'John',
                email: 'john@email.com',
                boardIds: [1],
                uid: '999999',
                role: 'MEMBER',
              };
            },
            id: 'bbbbbbbb',
          },
        ],
      });
    });
    const users = await getBoardUsers(mockBoard, mockArgs, mockUserMember);
    expect(users).toHaveLength(2);
    expect(users).not.toHaveLength(4);
    expect(users[0]).toHaveProperty('userName');
    expect(users[0]).toHaveProperty('id');
  });

  it('fails to get users if the requesting user is not logged in', async () => {
    const users = await getBoardUsers(mockBoard, mockArgs, mockUserNonMember);
    expect(users).toHaveLength(1);
    expect(users).not.toHaveLength(2);
    expect(users[0]).toHaveProperty('response');
    expect(users[0].id).toEqual('');
    expect(users[0].response.code).toEqual('400');
  });

  it('fails to get users if the requesting user does not have a "role" property', async () => {
    const users = await getBoardUsers(mockBoard, mockArgs, {});
    expect(users).toHaveLength(1);
    expect(users).not.toHaveLength(2);
    expect(users[0]).toHaveProperty('response');
    expect(users[0].id).toEqual('');
    expect(users[0].response.code).toEqual('400');
  });

  it('gets a list of board columns based on a board id', async () => {
    getFromCollectionWhere.mockImplementation(() => {
      return Promise.resolve({
        docs: [
          {
            data() {
              return {
                boardId: '1',
                name: 'Board 1',
                boardIds: [1],
                response: {},
              };
            },
            id: 'COLUMN1ID',
          },
          {
            data() {
              return {
                boardId: '2',
                name: 'Board 2',
                boardIds: [2],
                response: {},
              };
            },
            id: 'COLUMN2ID',
          },
        ],
      });
    });
    const columns = await getBoardColumns(mockBoard, mockArgs, mockUserMember);
    expect(columns).toHaveLength(2);
    expect(columns).not.toHaveLength(4);
    expect(columns[0]).toHaveProperty('name');
    expect(columns[0]).toHaveProperty('id');
  });

  it('fails to get columns if the requesting user is not logged in', async () => {
    const columns = await getBoardColumns(
      mockBoard,
      mockArgs,
      mockUserNonMember
    );
    expect(columns).toHaveLength(1);
    expect(columns).not.toHaveLength(2);
    expect(columns[0]).toHaveProperty('response');
    expect(columns[0].id).toEqual('');
    expect(columns[0].response.code).toEqual('400');
  });

  it('fails to get columns if the requesting user does not have a "role" property', async () => {
    const columns = await getBoardColumns(mockBoard, mockArgs, {});
    expect(columns).toHaveLength(1);
    expect(columns).not.toHaveLength(2);
    expect(columns[0]).toHaveProperty('response');
    expect(columns[0].id).toEqual('');
    expect(columns[0].response.code).toEqual('400');
  });

  it('gets a list of board comments based on a board id', async () => {
    getFromCollectionWhere.mockImplementation(() => {
      return Promise.resolve({
        docs: [
          {
            data() {
              return {
                commentId: '1',
                text: 'A first comment text',
                commentIds: [1],
                userId: 'akiryk',
                response: {},
              };
            },
            id: 'COMMENT1ID',
          },
          {
            data() {
              return {
                commentId: '2',
                text: 'A second comment!',
                commentIds: [2],
                userId: 'jsmith',
                response: {},
              };
            },
            id: 'COMMENT2ID',
          },
        ],
      });
    });
    const comments = await getBoardComments(
      mockBoard,
      mockArgs,
      mockUserMember
    );
    expect(comments).toHaveLength(2);
    expect(comments).not.toHaveLength(4);
    expect(comments[0]).toHaveProperty('text');
    expect(comments[0]).toHaveProperty('id');
  });

  it('fails to get comments if the requesting user is not logged in', async () => {
    const comments = await getBoardComments(
      mockBoard,
      mockArgs,
      mockUserNonMember
    );
    expect(comments).toHaveLength(1);
    expect(comments).not.toHaveLength(2);
    expect(comments[0]).toHaveProperty('response');
    expect(comments[0].id).toEqual('');
    expect(comments[0].response.code).toEqual('400');
  });

  it('fails to get comments if the requesting user does not have a "role" property', async () => {
    const comments = await getBoardComments(mockBoard, mockArgs, {});
    expect(comments).toHaveLength(1);
    expect(comments).not.toHaveLength(2);
    expect(comments[0]).toHaveProperty('response');
    expect(comments[0].id).toEqual('');
    expect(comments[0].response.code).toEqual('400');
  });
});
