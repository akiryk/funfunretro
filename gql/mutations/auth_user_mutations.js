/**
 * Auth User Mutations
 */
const { db, admin } = require('../../utils/admin');
const firebase = require('firebase');
const config = require('../../utils/config.js');

firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
} = require('../../utils/validators');

exports.createAuthUser = async (_, { input: args }) => {
  const { email, userName, password } = args;
  const newUser = {
    email,
    userName,
    password,
  };
  const { isValid } = validateSignupData(newUser);
  if (!isValid) {
    return {
      code: '400',
      success: false,
      message: 'Missing required user name or password',
    };
  }

  try {
    // Async await for user info
    const doc = await db.doc(`users/${newUser.userName}`).get();

    if (doc.exists) {
      return {
        code: '400',
        success: false,
        message: 'This userName is already taken',
      };
    }
    // Async await for firebase to create authenticated user
    const newAuthUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);

    // Async await for the new user's token
    const token = await newAuthUser.user.getIdToken();
    const userAuthId = newAuthUser.user.uid;
    const userCredentials = {
      userName: newUser.userName,
      email: newUser.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userAuthId,
    };

    // Async await for firebase to create a new user profile
    await db.doc(`/users/${newUser.userName}`).set(userCredentials);

    return {
      code: '201',
      success: true,
      message: 'Signed up a new user',
      token,
      userAuthId,
      user: {
        userName,
        email,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      code: '400',
      success: false,
      message: 'Unable to create a new authenticated user',
    };
  }
};

exports.login = async (_, { input: args }) => {
  const { email, password } = args;
  const user = {
    email,
    password,
  };

  const { isValid } = validateLoginData(user);
  if (!isValid) {
    return {
      code: '201',
      success: false,
      message: 'Missing valid login name or password',
    };
  }
  try {
    const data = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);

    const token = await data.user.getIdToken();
    return {
      code: '200',
      success: true,
      message: 'success logging in!',
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      code: '400',
      success: false,
      message: 'Unable to log in',
    };
  }
};
