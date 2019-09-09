require('dotenv').config({ path: __dirname + '/.env' });
const functions = require('firebase-functions');
const express = require('express');

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream
} = require('./handlers/screams');
const {
  signup,
  login,
  addUserDetails,
  uploadImage,
  getAuthenticatedUser
} = require('./handlers/users');

const FBAuth = require('./util/FBAuth');

const app = express();

// scream routes
app.get('/screams', getAllScreams);
app.post('/screams', FBAuth, postOneScream);
app.get('/screams/:screamId', getScream);
app.post('/screams/:screamId/comment', FBAuth, commentOnScream);
app.get('/screams/:screamId/like', FBAuth, likeScream);
app.get('/screams/:screamId/unlike', FBAuth, unlikeScream);

// user routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', FBAuth, getAuthenticatedUser);
app.post('/user/', FBAuth, addUserDetails);
app.post('/user/image', FBAuth, uploadImage);

// https://example.com/api/...:
exports.api = functions.https.onRequest(app);
