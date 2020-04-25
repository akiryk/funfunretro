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
    "The userName is the user id"
    userNames: [String]
    users: [User]
    "The max number of likes a user can add to the board"
    maxLikes: Int
    likesByUser: [[String]]
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
    "createdBy is the userName of the comment author"
    createdBy: String
    user: User
    likes: Int
    response: QueryResponse
  }
  type User {
    "User id is their uid"
    id: ID!
    "The userName and user id are the same by design"
    userName: String
    role: String
    email: String
    boardIds: [String]
    boards: [Board]
    comments: [Comment]
    response: QueryResponse
  }

  enum Role {
    MEMBER
    EDITOR
    ADMIN
  }
`;
