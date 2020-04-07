const firebase = require('firebase');
const config = require('../utils/config.js');
const { db } = require('../utils/admin');

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
} = require('../utils/validators');

firebase.initializeApp(config);

/**
 * Sign up -- create a new user and login
 *
 */
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };
  const { isValid, errors } = validateSignupData(newUser);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let token;
  let userId;

  db.doc(`users/${newUser.userName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ userName: 'this userName is already taken' });
      }
      return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((tokenId) => {
      token = tokenId;
      const userCredentials = {
        userName: newUser.userName,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        boardIds: [],
        userId,
      };
      return db.doc(`/users/${newUser.userName}`).set(userCredentials);
    })
    .then(() => res.status(201).json({ token }))
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already in use' });
      }
      return res
        .status(500)
        .json({ general: 'Something went wrong, please try again' });
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { isValid, errors } = validateLoginData(user);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => data.user.getIdToken())
    .then((token) => res.json({ token }))
    .catch((err) => {
      switch (err.code) {
        case 'auth/invalid-email':
          return res.status(400).json({ email: 'Incorrectly formatted email' });
        case 'auth/wrong-password':
          return res
            .status(403)
            .json({ password: 'Wrong credentials, please try again' });
        case 'auth/user-not-found':
          return res
            .status(400)
            .json({ email: 'Are you sure you are a user?' });
        default:
          return res.status(403).json({
            // return res.status(500).json({ error: err.code });
            unknownError: err.code,
          });
      }
    });
};

exports.addUserDetails = (req, res) => {
  const userDetails = reduceUserDetails(req.body);
  db.doc(`/users/${req.user.userName}`)
    .update(userDetails)
    .then(() =>
      res.json({
        message: 'successfully updated user details',
        updatedDetails: { ...userDetails },
      })
    )
    .catch((err) => res.status(500).json({ error: err.code }));
};

exports.getAuthenticatedUser = (req, res) => {
  const userData = {};
  console.log('R E Q', req.user);
  db.doc(`/users/${req.user.userName}`)
    .get()
    .then((doc) => {
      console.log('D O C', doc.exists, doc);
      if (doc.exists) {
        userData.credentials = doc.data();
        const likes = db
          .collection('likes')
          .where('useruserName', '==', req.user.userName)
          .get();
        console.log('L I K E S', likes);
        return likes;
      }
    })
    .then((data) => {
      console.log('D A T A', data);
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      // return res.json(userData);
      return db
        .collection('notifications')
        .where('recipient', '==', req.user.userName)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
