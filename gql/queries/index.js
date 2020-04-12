const { gql } = require('apollo-server-express');

exports.Queries = gql`
  type Query {
    boards: [Board]
    board(id: ID!): Board
    columns: [Column]
    column(id: ID!): Column
    comments: [Comment]
    comment(id: ID!): Comment
    users: [User]
    user(id: ID!): User
  }

  type ErrorResponse {
    message: String!
    code: String!
    success: Boolean!
  }

  type Board {
    name: String
    desc: String
    id: ID!
    columnIds: [String]
    columns: [Column]
    comments: [Comment]
    userIds: [String]
    users: [User]
    error: ErrorResponse
  }
  type Column {
    id: ID!
    boardId: String
    name: String
    comments: [Comment]
    error: ErrorResponse
  }
  type Comment {
    id: ID!
    columnId: String
    text: String
    boardId: String
    createdAt: String
    userId: String
    user: User
    error: ErrorResponse
  }
  type User {
    userName: String
    email: String
    boardIds: [String]
    boards: [Board]
    comments: [Comment]
    "User id is their username"
    id: ID!
    "userAuthId is the user UID from Authenticated Users table"
    uid: String!
    """
    There are three possible roles. From lowest privileges to highest, they are:
    'member', 'editor', 'admin'
    """
    roles: [String!]
    error: ErrorResponse
  }
`;
