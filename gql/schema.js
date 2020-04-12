const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Board implements QueryResponse {
    name: String
    desc: String
    id: ID
    columnIds: [String]
    columns: [Column]
    comments: [Comment]
    userIds: [String]
    users: [User]
    message: String
    code: String
    success: Boolean
  }
  type Column implements QueryResponse {
    id: ID
    boardId: String
    name: String
    comments: [Comment]
    message: String
    code: String
    success: Boolean
  }
  type Comment implements QueryResponse {
    id: ID
    columnId: String
    text: String
    boardId: String
    createdAt: String
    userId: String
    user: User
    message: String
    code: String
    success: Boolean
  }
  type User implements QueryResponse {
    userName: String
    email: String
    boardIds: [String]
    boards: [Board]
    comments: [Comment]
    id: ID!
    userId: String
    roles: [String!]
    message: String
    code: String
    success: Boolean
  }

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

  input SignupInput {
    userName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
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

  interface QueryResponse {
    """
    Every query should implement QueryResponse, a consistent
    way to returns meaningful information about errors or success.
    """
    code: String
    success: Boolean
    message: String
  }

  interface MutationResponse {
    """
    Every mutation should implement MutationResponse, a consistent
    way to returns meaningful information about errors or success.
    """
    code: String!
    success: Boolean!
    message: String!
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

  type CreateBoardResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    board: Board
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

  """
  Authenticated users are created with the Firebase SDK.
  """
  type SignupResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
    "Token is a JSON web token returned by the Firebase auth service."
    token: String
    "userAuthId points to the uid of the Firebase authenticated user"
    userAuthId: String
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

  type LoginResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    token: String
  }

  type Mutation {
    createBoard(input: CreateBoardInput): CreateBoardResponse!
    createColumn(input: CreateColumnInput): CreateColumnResponse!
    createComment(input: CreateCommentInput): CreateCommentResponse!
    createUser(input: CreateUserInput): CreateUserResponse!
    signup(input: SignupInput): SignupResponse!
    login(input: LoginInput): LoginResponse!
    updateBoard(input: UpdateBoardInput): UpdateBoardResponse!
    updateColumn(input: UpdateColumnInput): UpdateColumnResponse!
    updateComment(input: UpdateCommentInput): UpdateCommentResponse!
    deleteColumn(input: DeleteColumnInput): DeleteColumnResponse!
    deleteComment(input: DeleteCommentInput): DeleteCommentResponse!
    deleteUser(input: DeleteUserInput): DeleteUserResponse!
  }
`;

module.exports = { typeDefs };
