exports.mockBoardsData = {
  docs: [
    {
      id: 'BoardAId',
      data: jest.fn().mockReturnValue({
        name: 'Board A',
        desc: 'A board for A',
        userIds: ['userA', 'userB'],
        columns: ['ColumnID1', 'ColumnID2'],
      }),
    },
    {
      id: 'BoardBId',
      data: jest.fn().mockReturnValue({
        name: 'BOARDS B',
        desc: 'A board for B',
        userIds: ['userA', 'userB', 'userC'],
        columns: ['ColumnID3', 'ColumnID4'],
      }),
    },
  ],
};

exports.mockColumnsData = {
  docs: [
    {
      id: 'ColumnID1',
      data: jest.fn().mockReturnValue({
        name: 'gold',
        boardId: 'BoardAId',
      }),
    },
    {
      id: 'ColumnID2',
      data: jest.fn().mockReturnValue({
        name: 'silver',
        boardId: 'BoardAId',
      }),
    },
    {
      id: 'ColumnID3',
      data: jest.fn().mockReturnValue({
        name: 'bronze',
        boardId: 'BoardBId',
      }),
    },
    {
      id: 'ColumnID4',
      data: jest.fn().mockReturnValue({
        name: 'tourmeline',
        boardId: 'BoardBId',
      }),
    },
  ],
};
