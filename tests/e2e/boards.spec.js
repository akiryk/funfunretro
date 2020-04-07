/**
 * Graphql Spec
 *
 * NOTE: REQUIRES LOCAL SERVER TO WORK
 */

const { graphQLClient } = require('./client');
const {
  getAllBoardsQuery,
  getBoardQuery,
  getBoardColumnQuery,
  getBoardColumnCommentQuery,
} = require('./board_queries');
const { createBoard } = require('./board_mutations');

const getAllBoards = async () => {
  const {
    data: { boards },
  } = await graphQLClient.query({
    query: getAllBoardsQuery,
  });
  return boards;
};

const getBoard = async (query) => {
  const {
    data: { board },
  } = await graphQLClient.query({
    query,
  });
  return board;
};

const createBoardMutation = async () => {
  const {
    data: { board },
  } = await graphQLClient.mutation({
    mutation: createBoard,
  });
};

describe('Board', () => {
  describe('queries', () => {
    it('retrieve all boards', async () => {
      const boardsList = await getAllBoards();
      expect(boardsList.length).toBeGreaterThan(3);
    });

    it('retrieves a single board', async () => {
      const board = await getBoard(getBoardQuery);
      expect(board.name).toEqual('my sweet sweet board');
    });

    it('returns all columns associated with a board', async () => {
      const board = await getBoard(getBoardColumnQuery);
      expect(board.columns[0]['__typename']).toEqual('Column');
      expect(board.columns[0]).toHaveProperty('name');
    });

    it("returns all comments associated with a board's columns", async () => {
      const board = await getBoard(getBoardColumnCommentQuery);
      const firstComment = board.columns[0].comments[0];
      expect(firstComment['__typename']).toEqual('Comment');
      expect(firstComment).toHaveProperty('text');
      expect(firstComment).toHaveProperty('boardId');
      expect(firstComment).toHaveProperty('columnId');
      expect(firstComment).toHaveProperty('userId');
    });
  });

  // describe('mutations', () => {
  //   it('creates a board', async () => {
  //     const board = await createBoardMutation({
  //       data: {
  //         args: {
  //           name: 'my name',
  //           desc: 'my desc',
  //         },
  //       },
  //     });
  //   });
  // });
});
