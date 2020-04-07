/**
 * Mock Board Queries for e2e tests
 */
const gql = require('graphql-tag');

exports.createBoard = gql`
  mutation createBoardFor($name: String!, $desc: String!) {
    createBoard(name: $name, desc: $desc) {
      name
      desc
    }
  }
`;
