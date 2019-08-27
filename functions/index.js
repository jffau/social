const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

exports.getScreams = functions.https.onRequest((request, response) => {
  admin
    .firestore()
    .collection(`screams`)
    .get()
    .then(data => {
      let screams = [];
      data.forEach(document => {
        screams.push(document.data());
      });
      return response.json(screams);
    })
    .catch(err => console.error(err));
});
