const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Board {
    name: String
    desc: String
    id: ID!
    columns: [Column]
    comments: [Comment]
    userIds: [String]
    users: [User]
  }
  type Column {
    id: ID!
    boardId: String
    name: String
    comments: [Comment]
  }
  type Comment {
    id: ID!
    columnId: String
    text: String
    boardId: String
    createdAt: String
    userId: String
    user: User
  }
  type User {
    username: String
    boardIds: [String]
    boards: [Board]
    comments: [Comment]
    id: ID!
  }
  type Query {
    boards: [Board]!
    board(id: ID!): Board
    columns: [Column]!
    column(id: ID!): Column
    comments: [Comment]!
    comment(id: ID!): Comment
    users: [User]!
    user(id: ID!): User
  }
`;

module.exports = { typeDefs };
