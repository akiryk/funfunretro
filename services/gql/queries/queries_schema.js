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
    "the currently logged in user"
    me: User
  }

  type QueryResponse {
    message: String!
    code: String
    success: Boolean
  }

  type Board {
    name: String
    desc: String
    id: ID
    columnIds: [String]
    columns: [Column]
    "The userName is the user id"
    userNames: [String]
    users: [User]
    "The max number of likes a user can add to the board"
    maxLikes: Int
    """
    An array of arrays, showing the number of times
    each user has liked a comment on the board
    e.g. [['user1', 5], ['user2', 2]]
    """
    likesByUser: [[String]]
    response: QueryResponse
  }
  type Column {
    id: ID
    boardId: String
    "The name/title of the column"
    name: String
    "Comments added to this column"
    comments: [Comment]
    response: QueryResponse
  }
  type Comment {
    id: ID
    columnId: String
    "The text of the comment - that is, the comment itself"
    text: String
    "The boardId of the board where the comment was made"
    boardId: String
    "Timestamp"
    createdAt: String
    "The userName of the comment author"
    createdBy: String
    "the user who created the comment"
    user: User
    "The number of times this comment has been liked"
    likes: Int
    response: QueryResponse
  }

  type User {
    "User id is their uid"
    id: ID
    "The userName and user id are the same by design"
    userName: String
    "Role is an enum"
    role: Role
    email: String
    "Ids for the boards to which a given user belongs"
    boardIds: [String]
    "The boards to which a given user belongs"
    boards: [Board]
    "The comments made by a given user"
    comments: [Comment]
    response: QueryResponse
  }

  enum Role {
    MEMBER
    EDITOR
    ADMIN
  }
`;
