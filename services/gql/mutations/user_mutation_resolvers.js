// There is only delete, no create, because you create by signing up a new auth user

const { deleteUser } = require('../../firebase/user');

module.exports = { deleteUser };
