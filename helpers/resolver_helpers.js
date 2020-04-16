/**
 * Helpers for resolvers
 */

/**
 * @param {string} action -- the action being performed, e.g. "create"
 * @param {string} dataType -- the type, e.g. "column" or "board"
 * @return {object} Graphql MutationResponse object
 */
exports.getGenericMutationResponseForError = (
  action = 'perform the action',
  dataType = ''
) => ({
  code: '400',
  success: false,
  message: `Unable to ${action} ${dataType}`,
});

const privileges = {
  NO_ROLE: 0,
  MEMBER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

exports.isMember = ({ role = 'NO_ROLE' } = {}) => privileges[role] > 0;

exports.isEditor = ({ role = 'NO_ROLE' } = {}) => privileges[role] > 1;

exports.isAdmin = ({ role = 'NO_ROLE' } = {}) => privileges[role] > 2;
