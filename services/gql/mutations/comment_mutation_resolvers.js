const Comment = require('../../firebase/Comment');

const { getUserById } = require('../../firebase/user');

const {
  isUserMember,
  isUserAdmin,
} = require('../../firebase/utils/auth_helpers');

const {
  getMutationErrorResponse,
} = require('../../firebase/utils/firestore_helpers');

const isUserMemberOfBoard = (boardId, userBoardIds) =>
  userBoardIds.includes(boardId);

const createComment = async (_, { input }, { user }) => {
  const userProfile = await getUserById(user.userName);
  return (isUserMember(user) &&
    isUserMemberOfBoard(userProfile.boardIds, input.boardId)) ||
    isUserAdmin(user)
    ? Comment.createComment(input, user.userName)
    : getMutationErrorResponse(
        'you can only comment on boards where you are a member'
      );
};

const updateComment = async (_, { input }, { user }) => {
  const isAdmin = isUserAdmin(user);
  return isUserMember(user)
    ? Comment.updateComment(input, user.userName, isAdmin)
    : getMutationErrorResponse(
        'you can only comment on boards where you are a member'
      );
};

const deleteComment = async (_, { input }, { user }) => {
  return isUserMember(user)
    ? Comment.deleteComment(input.id, user.userName, isUserAdmin(user))
    : getMutationErrorResponse('User must be logged in to delete a comment');
};

const likeComment = async (_, { input }, { user }) => {
  if (!isUserMember(user)) {
    return {
      response: {
        message: 'You must be logged in',
        code: '400',
        success: false,
      },
    };
  }

  const userProfile = await getUserById(user.userName);
  return userProfile.boardIds.includes(input.boardId)
    ? Comment.likeComment(input, user.userName)
    : {
        response: {
          message:
            'You are not a member of this board so can not like its comments. And, yes, this even goes for Admins',
          code: '400',
          success: false,
        },
      };
};
const unlikeComment = async (_, { input }, { user }) => {
  if (!isUserMember(user)) {
    return {
      response: {
        message: 'You must be logged in',
        code: '400',
        success: false,
      },
    };
  }

  const userProfile = await getUserById(user.userName);
  return userProfile.boardIds.includes(input.boardId)
    ? Comment.unlikeComment(input, user.userName)
    : {
        response: {
          message:
            'You are not a member of this board so can not unlike its comments. And, yes, this even goes for Admins',
          code: '400',
          success: false,
        },
      };
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
