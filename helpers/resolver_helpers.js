/**
 * Helpers for resolvers
 */

/**
 * Return board data from a board query snapshot
 *
 * @param {object} board - the board querySnapshot
 * @returns {object} the board data in shape required by schema
 */
exports.getBoardData = (board) => {
  return {
    ...board.data(),
    id: board.id,
  };
};
/**
 * @param {string} action -- the action being performed, e.g. "create"
 * @param {string} dataType -- the type, e.g. "column" or "board"
 * @return {object} Graphql MutationResponse object
 */
// exports.getGenericMutationResponseForError = (
//   action = 'perform the action',
//   dataType = ''
// ) => ({
//   code: '400',
//   success: false,
//   message: `Unable to ${action} ${dataType}`,
// });

const privileges = {
  NO_ROLE: 0,
  MEMBER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

exports.isMember = ({ role = 'NO_ROLE' } = {}) => privileges[role] > 0;

exports.isEditor = ({ role = 'NO_ROLE' } = {}) => privileges[role] > 1;

exports.isAdmin = ({ role = 'NO_ROLE' } = {}) => privileges[role] > 2;

exports.getErrorResponse = (
  message = 'Uh oh, there was a problem',
  code = '400'
) => ({
  message,
  code,
  success: false,
});

exports.getSuccessResponse = (message = 'Yes, it worked') => ({
  message,
  code: '200',
  success: true,
});
