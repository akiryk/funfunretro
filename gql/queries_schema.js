const { gql } = require('apollo-server-express');

exports.Queries = gql`
  type Query {
    "Retrieve all boards (only by admins)"
    boards: [Board]
    board(id: ID!): Board
    "Retrieve the logged in user's boards"
    myBoards: [Board]
    columns: [Column]
    column(id: ID!): Column
    comments: [Comment]
    comment(id: ID!): Comment
    users: [User]
    user(id: ID!): User
    "get basic information about the currently logged in user"
    whoAmI: User
  }

  type QueryResponse {
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
    response: QueryResponse
  }
  type Column {
    id: ID!
    boardId: String
    name: String
    comments: [Comment]
    response: QueryResponse
  }
  type Comment {
    id: ID!
    columnId: String
    text: String
    boardId: String
    createdAt: String
    userId: String
    user: User
    response: QueryResponse
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
    role: Role
    response: QueryResponse
  }

  enum Role {
    MEMBER
    EDITOR
    ADMIN
  }
`;
