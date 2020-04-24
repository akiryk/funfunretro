/**
 * Auth User Mutations
 */
const { db, admin, firebase } = require('./utils/app_config');
const { MEMBER_ROLE, ROLES } = require('./utils/auth_helpers');

const { validateSignupData, validateLoginData } = require('./utils/validators');

exports.signup = async ({ email, userName, password }) => {
  const { isValid } = validateSignupData({
    email,
    userName,
    password,
  });
  if (!isValid) {
    return {
      code: '400',
      success: false,
      message: 'Missing required user name or password',
    };
  }

  try {
    // Async await for user info
    // const doc = await db.collection('users').doc('userName', '==', userName);
    const doc = await db.doc(`users/${userName}`).get();
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
      .createUserWithEmailAndPassword(email, password);

    // Async await for the new user's token
    const token = await newAuthUser.user.getIdToken();
    const uid = newAuthUser.user.uid;

    await newAuthUser.user.updateProfile({
      displayName: userName,
      email,
      uid,
    });

    await admin.auth().setCustomUserClaims(uid, {
      role: 'MEMBER',
    });

    const userCredentials = {
      userName,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      boardIds: [],
      role: 'MEMBER',
    };

    // Async await for admin to create a new user profile
    await db.doc(`/users/${userName}`).set(userCredentials);

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

exports.login = async (email, password) => {
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
    const userName = data.user.displayName;

    // get user record so we can access custom claims for role
    const userRecord = await admin.auth().getUser(data.user.uid);
    const role = userRecord.customClaims['role'];

    return {
      id: userName,
      role,
      userName,
      email,
      token,
      code: '200',
      success: true,
      message: 'Logged in!',
    };
  } catch (error) {
    return {
      code: '500',
      success: false,
      message: error,
    };
  }
};

exports.addRole = async ({ email, role }) => {
  // role must be EDITOR, MEMBER, or ADMIN
  if (!ROLES.includes(role)) {
    return {
      code: '400',
      success: false,
      message: `${role} is not a designated role`,
    };
  }

  let user;
  try {
    user = await admin.auth().getUserByEmail(email);
  } catch (error) {
    return {
      code: '400',
      success: false,
      message: `No user corresponds with ${email}`,
    };
  }

  try {
    await admin.auth().setCustomUserClaims(user.uid, {
      [role]: true,
    });
    return {
      code: '200',
      success: true,
      message: `${email} is now ${role.toLowerCase()}`,
    };
  } catch (error) {
    return {
      code: '500',
      success: false,
      message: error,
    };
  }
};
