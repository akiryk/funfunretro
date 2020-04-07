/**
 * Mock Board Queries for e2e tests
 */
const gql = require('graphql-tag');

exports.getAllBoardsQuery = gql`
  query Boards {
    boards {
      name
    }
  }
`;

exports.getBoardQuery = gql`
  query Board {
    board(id: "07hqwKZjcMoPwagAmgfi") {
      name
    }
  }
`;

exports.getBoardColumnQuery = gql`
  query Board {
    board(id: "07hqwKZjcMoPwagAmgfi") {
      columns {
        name
      }
    }
  }
`;

exports.getBoardColumnCommentQuery = gql`
  query Board {
    board(id: "07hqwKZjcMoPwagAmgfi") {
      columns {
        comments {
          text
          userId
          boardId
          columnId
        }
      }
    }
  }
`;
