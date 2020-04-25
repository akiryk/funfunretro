const {
  signup: signupUser,
  login: loginUser,
  addRole: addRoleUser,
} = require('../../firebase/auth_user');
const { isUserAdmin } = require('../../firebase/utils/auth_helpers');
const {
  getMutationErrorResponse,
} = require('../../firebase/utils/firestore_helpers');

const signup = async (_, { input }) => signupUser(input);

const login = async (_, { input }) => {
  const { email, password } = input;
  return loginUser(email, password);
};
const addRole = async (_, { input }, { user }) => {
  // get the email of the user to me made an admin
  const { email, role } = input;
  return isUserAdmin(user)
    ? addRoleUser({ email, role })
    : getMutationErrorResponse('only admins can make other users an admin');
};

module.exports = { signup, login, addRole };
