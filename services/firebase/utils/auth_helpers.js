/**
 * Constants
 */

exports.MEMBER_ROLE = 'MEMBER';
exports.ADMIN_ROLE = 'ADMIN';
exports.EDITOR_ROLE = 'EDITOR';
exports.ROLES = [this.MEMBER_ROLE, this.ADMIN_ROLE, this.EDITOR_ROLE];

const privileges = {
  NO_ROLE: 0,
  MEMBER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

exports.isMember = (role = 'NO_ROLE') => privileges[role] > 0;

exports.isEditor = (role = 'NO_ROLE') => privileges[role] > 1;

exports.isAdmin = (role = 'NO_ROLE') => privileges[role] > 2;

exports.isUserMember = (user) => user && user.role && this.isMember(user.role);

exports.isUserEditor = (user = {}) =>
  user && user.role && this.isEditor(user.role);

exports.isUserAdmin = (user = {}) =>
  user && user.role && this.isAdmin(user.role);
