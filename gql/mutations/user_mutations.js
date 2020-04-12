/**
 * User Mutations
 */
const { db, admin } = require('../../utils/firebase');
const { getByIdFromCollection } = require('../../helpers/gql_helpers');
const {
  getGenericMutationResponseForError,
} = require('../../helpers/resolver_helpers');
const { MEMBER_ROLE } = require('../../constants');

exports.createUser = async (_, { input: args }) => {
  let userName = args.userName.replace(/\s+/g, '');
  try {
    const user = await getByIdFromCollection(userName, 'users');
    if (user.exists) {
      return {
        code: '400',
        success: false,
        message: `oooh, that userName is already taken`,
      };
    }
    const roles = args.roles || [MEMBER_ROLE];
    const email = args.email || '';
    const boardIds = args.boardIds || [];
    await admin.firestore().collection('users').doc(userName).set({
      userName,
      boardIds,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      roles,
    });
    return {
      code: '200',
      success: true,
      message: `Successfully created new user, ${userName}`,
      user: {
        userName,
        roles,
        email,
        boardIds,
        id: userName,
      },
    };
  } catch (error) {
    console.log(error);
    return getGenericMutationResponseForError('create', 'user');
  }
};

// TODO: when deleting a user, should we delete the user comments as well?
exports.deleteUser = async (_, { input: args }) => {
  if (!args || !args.id) {
    return {
      code: '400',
      success: false,
      message: `Sorry, but you never gave a user id`,
    };
  }
  const userToDelete = db.doc(`/users/${args.id}`);
  try {
    const userDoc = await userToDelete.get();
    if (!userDoc.exists) {
      return {
        code: '400',
        success: false,
        message: `User with id ${args.id} does not exist`,
      };
    }
    await userToDelete.delete();
    return {
      code: '200',
      success: true,
      message: `User ${args.id} deleted successfully`,
    };
  } catch (error) {
    console.log(error);
    return getGenericMutationResponseForError('delete', 'user');
  }
};
