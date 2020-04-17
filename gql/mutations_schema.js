/**
 * Mutations
 */
const { gql } = require('apollo-server-express');

exports.Mutations = gql`
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

  input LikeCommentInput {
    "The comment id"
    id: String!
    "The id of the board that contains the comment"
    boardId: String!
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

  type LikeCommentResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
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
    userName: String
    uid: String
    email: String
    boardIds: [String]
    role: Role
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
    likeComment(input: LikeCommentInput): LikeCommentResponse!
    deleteColumn(input: DeleteColumnInput): DeleteColumnResponse!
    deleteComment(input: DeleteCommentInput): DeleteCommentResponse!
    deleteUser(input: DeleteUserInput): DeleteUserResponse!
  }
`;
