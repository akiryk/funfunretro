/**
 * Auth User Mutations
 */
const { db, admin, firebase } = require('./utils/firebase');
const { MEMBER_ROLE } = require('./utils/auth_helpers');
const { createUser } = require('./user');

const { validateSignupData, validateLoginData } = require('./utils/validators');

exports.signup = async (_, { input: args }) => {
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
    // Async await for admin to create authenticated user
    const newAuthUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);

    // Async await for the new user's token
    const token = await newAuthUser.user.getIdToken();
    const uid = newAuthUser.user.uid;
    const userCredentials = {
      userName: newUser.userName,
      email: newUser.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      uid,
      role: MEMBER_ROLE,
      boardIds: [],
    };
    await createUser(null, {
      input: userCredentials,
    });
    // Async await for admin to create a new user profile
    // await db.doc(`/users/${newUser.userName}`).set(userCredentials);

    return {
      code: '201',
      success: true,
      message: 'Signed up a new user',
      token,
      user: {
        ...userCredentials,
        id: userName,
      },
    };
  } catch (error) {
    console.log(error);
    if (error.code === 'auth/email-already-in-use') {
      return {
        code: '400',
        success: false,
        message: 'Try another email, that one is already taken',
      };
    }
    return {
      code: '400',
      success: false,
      message: 'Unable to create a new authenticated user',
    };
  }
};

exports.login = async (_, { input: args }) => {
  const { email, password } = args;

  const { isValid } = validateLoginData({ email, password });
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
      .signInWithEmailAndPassword(email, password);

    const token = await data.user.getIdToken();

    const userProfile = await admin
      .firestore()
      .collection('users')
      .where('uid', '==', data.user.uid)
      .get();

    const { boardIds, role, userName } = userProfile.docs[0].data();
    return {
      boardIds,
      email,
      userName,
      role,
      token,
      uid: data.user.uid,
      code: '200',
      success: true,
      message: 'Logged in!',
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
