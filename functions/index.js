const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const firebase = require('firebase');
const app = express();
admin.initializeApp();

const firebaseConfig = {
  apiKey: 'AIzaSyDFqd2Qjs4Csf6CMc6wKONa0MNAv88DKn4',
  authDomain: 'socialape-8fb19.firebaseapp.com',
  databaseURL: 'https://socialape-8fb19.firebaseio.com',
  projectId: 'socialape-8fb19',
  storageBucket: 'socialape-8fb19.appspot.com',
  messagingSenderId: '420707583038',
  appId: '1:420707583038:web:ba903df403ec9f96'
};

firebase.initializeApp(firebaseConfig);

app.get('/screams', (req, res) => {
  admin
    .firestore()
    .collection(`screams`)
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

  admin
    .firestore()
    .collection(`screams`)
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      response.status(500).json({ error: `Something went wrong` });
      console.error(err);
    });
});

// signup route
app.post('/signup', (req, res) => {
  const { email, password, confirmPassword, handle } = req.body;
  const newUser = {
    email,
    password,
    confirmPassword,
    handle
  };

  // TODO: validate data

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signed up successfully` });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

// https://example.com/api/...:
exports.api = functions.https.onRequest(app);
