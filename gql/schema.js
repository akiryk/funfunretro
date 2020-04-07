const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Board {
    name: String!
    desc: String
    id: ID!
    columnIds: [String]
    columns: [Column]
    comments: [Comment]
    userIds: [String]
    users: [User]
  }
  type Column {
    id: ID!
    boardId: String!
    name: String!
    comments: [Comment]
  }
  type Comment {
    id: ID!
    columnId: String!
    text: String!
    boardId: String!
    createdAt: String
    userId: String!
    user: User
  }
  type User {
    userName: String!
    email: String
    boardIds: [String]
    boards: [Board]
    comments: [Comment]
    id: ID!
    message: String
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

  """
  Every mutation should implement MutationResponse, a consistent
  way to returns meaningful information about errors or success.
  """
  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  input CreateBoardInput {
    name: String!
    desc: String
  }

  input CreateColumnInput {
    name: String!
    boardId: String!
  }

  input CreateCommentInput {
    columnId: String!
    userId: String!
    text: String!
  }

  input CreateUserInput {
    userName: String!
    boardIds: [String]
    email: String
  }

  input DeleteColumnInput {
    id: String!
  }

  input DeleteCommentInput {
    id: String!
  }

  input DeleteUserInput {
    id: String!
  }

  input UpdateBoardInput {
    id: String!
    name: String
    desc: String
  }

  input UpdateColumnInput {
    id: String!
    name: String!
  }

  input UpdateCommentInput {
    id: String!
    text: String!
  }

  type CreateBoardResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    board: Board
  }

  type UpdateBoardResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    board: Board
  }

  type UpdateColumnResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    column: Column
  }

  type UpdateCommentResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    comment: Comment
  }

  type CreateColumnResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    column: Column
  }

  type CreateCommentResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    comment: Comment
  }

  type CreateUserResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
  }

  type DeleteColumnResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type DeleteCommentResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type DeleteUserResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type Mutation {
    createBoard(input: CreateBoardInput): CreateBoardResponse!
    createColumn(input: CreateColumnInput): CreateColumnResponse!
    createComment(input: CreateCommentInput): CreateCommentResponse!
    createUser(input: CreateUserInput): CreateUserResponse!
    updateBoard(input: UpdateBoardInput): UpdateBoardResponse!
    updateColumn(input: UpdateColumnInput): UpdateColumnResponse!
    updateComment(input: UpdateCommentInput): UpdateCommentResponse!
    deleteColumn(input: DeleteColumnInput): DeleteColumnResponse!
    deleteComment(input: DeleteCommentInput): DeleteCommentResponse!
    deleteUser(input: DeleteUserInput): DeleteUserResponse!
  }
`;

module.exports = { typeDefs };
