require('dotenv').config({ path: __dirname + '/.env' });
const functions = require('firebase-functions');
const express = require('express');
const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signup, login, uploadImage } = require('./handlers/users');
const FBAuth = require('./util/FBAuth');

const app = express();

// scream routes
app.get('/screams', getAllScreams);
app.post('/screams', FBAuth, postOneScream);

// user routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', uploadImage);

// https://example.com/api/...:
exports.api = functions.https.onRequest(app);
