const { db } = require('../util/admin');

exports.getAllScreams = (req, res) => {
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
};

exports.postOneScream = (req, res) => {
  const { body } = req.body;
  const newScream = {
    body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString()
  };

  db.collection(`screams`)
    .add(newScream)
    .then(doc => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      res.json({ resScream });
    })
    .catch(err => {
      response.status(500).json({ error: `Something went wrong` });
      console.error(err);
    });
};

exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Scream not found' });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('screamId', '==', req.params.screamId)
        .get();
    })
    .then(data => {
      screamData.comments = [];
      data.forEach(doc => {
        screamData.comments.push(doc.data());
      });
      return res.json(screamData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.commentOnScream = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ error: 'Comment can not be empty' });
  }
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Not Found' });
      }
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      // at this point the comment is successfully created,
      // this is used to add it for the commenting user's UI

      res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData;
  screamDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Scream not found' });
      }
    })
    .then(data => {
      // if not liked:
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            screamId: req.params.screamId,
            userHandle: req.user.handle
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument
              .update({
                likeCount: screamData.likeCount
              })
              .then(() => {
                return res.json(screamData);
              });
          });
      } else {
        return res.status(400).json({ error: 'Scream already liked' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);

  let screamData;
  screamDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Scream not found' });
      }
    })
    .then(data => {
      // if not liked:
      if (data.empty) {
        return res.status(400).json({ error: 'Scream is not liked already' });
      } else {
        return db
          .doc(`/likes/${data.docs[0].data().id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(ScreamData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
