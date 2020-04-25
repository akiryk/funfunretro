const {
  createComment: createComm,
  updateComment: updateComm,
  deleteComment: deleteComm,
  likeComment: likeComm,
  unlikeComment: unlikeComm,
} = require('../../firebase/comment');

const { getUserById } = require('../../firebase/user');

const {
  isUserMember,
  isUserAdmin,
} = require('../../firebase/utils/auth_helpers');

const {
  isUserMemberOfBoard,
  getMutationErrorResponse,
} = require('../../firebase/utils/firestore_helpers');

const createComment = async (_, { input }, { user }) => {
  const userProfile = await getUserById(user.userName);
  return (isUserMember(user) &&
    isUserMemberOfBoard(userProfile, input.boardId)) ||
    isUserAdmin(user)
    ? createComm(input, user.userName)
    : getMutationErrorResponse(
        'you can only comment on boards where you are a member'
      );
};

const updateComment = async (_, { input }, { user }) => {
  const isAdmin = isUserAdmin(user);
  return isUserMember(user)
    ? updateComm(input, user.userName, isAdmin)
    : getMutationErrorResponse(
        'you can only comment on boards where you are a member'
      );
};

const deleteComment = async (_, { input }, { user }) => {
  return isUserMember(user)
    ? deleteComm(input.id, user.userName, isUserAdmin(user))
    : getMutationErrorResponse('User must be logged in to delete a comment');
};

const likeComment = async (_, { input }, { user }) => {
  return isUserMember(user) && isUserMemberOfBoard(user, input.boardId)
    ? likeComm(input, user.userName)
    : getMutationErrorResponse(
        'you can only like comments on boards where you are a member'
      );
};
const unlikeComment = async (_, { input }, { user }) => {
  return isUserMember(user) && isUserMemberOfBoard(user, input.boardId)
    ? unlikeComm(input, user.userName)
    : getMutationErrorResponse(
        'you can only unlike comments on boards where you are a member'
      );
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
