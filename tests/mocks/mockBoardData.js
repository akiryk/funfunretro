const board1 = {
  columns: [],
  createdAt: '0234',
  desc: 'Description text',
  name: 'A Mock Board',
  userIds: [],
};

const boards = [board1];

const mockListOf2Boards = {
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
};

const mockListOfMyBoards = mockListOf2Boards;

module.exports = { boards, board1, mockListOf2Boards, mockListOfMyBoards };
