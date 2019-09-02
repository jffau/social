require('dotenv').config({ path: __dirname + '/.env' });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const firebase = require('firebase');

const app = express();
admin.initializeApp();
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: 'socialape-8fb19.firebaseapp.com',
  databaseURL: 'https://socialape-8fb19.firebaseio.com',
  projectId: 'socialape-8fb19',
  storageBucket: 'socialape-8fb19.appspot.com',
  messagingSenderId: '420707583038',
  appId: '1:420707583038:web:ba903df403ec9f96'
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

app.get('/screams', (req, res) => {
  db.collection(`screams`)
    .orderBy(`createdAt`, `desc`)
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          ...doc.data()
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
});

app.post('/screams', (req, res) => {
  const { body, userHandle } = req.body;
  const newScream = {
    body,
    userHandle,
    createdAt: new Date().toISOString()
  };

  db.collection(`screams`)
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      response.status(500).json({ error: `Something went wrong` });
      console.error(err);
    });
});

const isEmpty = string => {
  if (string.trim() === '') return true;
  else return false;
};

const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};
// signup route
app.post('/signup', (req, res) => {
  const { email, password, confirmPassword, handle } = req.body;
  const newUser = {
    email,
    password,
    confirmPassword,
    handle
  };

  let errors = {};

  if (isEmpty(email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Not a valid email';
  }

  if (isEmpty(newUser.password)) errors.password = 'Must not be empty';
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = 'Passwords must match';
  if (isEmpty(newUser.handle)) errors.handle = 'Must not be empty';

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        // Handle is taken
        return res.status(400).json({
          handle: 'this handle is already taken'
        });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({
          email: 'Email is already in use'
        });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

// https://example.com/api/...:
exports.api = functions.https.onRequest(app);
