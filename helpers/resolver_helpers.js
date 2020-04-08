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
