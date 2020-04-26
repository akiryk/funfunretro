/**
 * Auth User
 *
 * CRUD operations for Auth User in Firebase
 *
 */
const { db, admin, firebase } = require('./utils/app_config');
const { ROLES } = require('./utils/auth_helpers');

const { validateSignupData, validateLoginData } = require('./utils/validators');

/**
 * Verify that a user is authorized based on request header
 */
exports.getAuthUser = async (req) => {
  let idToken;
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('No token found');
    // return a non authorized user object
    return {
      role: '',
    };
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // get the user record with additional data about roles and username
    const userRecord = await admin.auth().getUser(uid);
    const userName = userRecord.displayName;
    const role = userRecord.customClaims['role'];

    const user = {
      uid,
      role,
      userName,
      email,
    };

    return user;
  } catch (err) {
    console.log('Error while verifying token; probably expired');
    return {
      role: '',
    };
  }
};

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
        role: 'MEMBER',
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
      id: data.user.uid,
      profile: {
        userName,
        role,
        email,
      },
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
      role,
    });
  } catch (error) {
    return {
      code: '500',
      success: false,
      message: error,
    };
  }

  try {
    // update the user's profile
    await db.collection('users').doc(user.displayName).update({
      role,
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
