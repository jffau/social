const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const app = express();
admin.initializeApp();

app.get('/screams', (req, res) => {
  admin
    .firestore()
    .collection(`screams`)
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
    body: body,
    userHandle: userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
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

// https://example.com/api/...:
exports.api = functions.https.onRequest(app);
