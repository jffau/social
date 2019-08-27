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

exports.createScreams = functions.https.onRequest((request, response) => {
  if (request.method !== 'POST') {
    return response.staus(400).json({ error: 'HTTP method not allowed' });
  }
  const { body, userHandle } = request.body;
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
      response.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      response.status(500).json({ error: `Something went wrong` });
      console.error(err);
    });
});
