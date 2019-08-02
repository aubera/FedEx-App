const express = require('express');
const router = express.Router();
const multer = require('multer');
const tokenCheckMW = require('../service/token-validation');
const fs = require('fs');

const User = require('../models/user');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid MIME type');
    if (isValid) {
      error = null;
    }
    callback(error, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, `${name}-${Date.now()}.${ext}`);
  }
});

router.put('/picture/:username?', tokenCheckMW.accessTokenCheck, multer({storage: storage}).single('image'),(req, res) => {
  const username = req.params.username;
  const url = req.protocol + '://' + req.get('host');
  const imagePath = url + '/images/' + req.file.filename;
  User.findOneAndUpdate({username: username}, {avatarPath: imagePath}, {new: true})
    .then((updatedUser) => {
      res.status(200).json(updatedUser);
    })
    .catch(() => {
      res.status(500).json({
        'message': 'Something went wrong, please try again later.'
      });
    });
});

// router.put('/avatars/:username?', tokenCheckMW.accessTokenCheck, (req, res) => {
//   if (!req.headers['content-type'].includes('application/json')) {
//     res.status(400).json({
//       'message': 'Content-type is not specified.'
//     });
//   } else {
//     const username = req.params.username;
//     const imagePath = req.body.avatar;
//     User.findOneAndUpdate({username: username}, {settings: {avatarPath: imagePath}}, {new: true})
//       .then((updatedUser) => {
//         res.status(200).json(updatedUser);
//       })
//       .catch(() => {
//         res.status(500).json({
//           'message': 'Something went wrong, please try again later.'
//         });
//       });
//   }
// });

// router.get('/avatars', tokenCheckMW.accessTokenCheck, (req, res) => {
//   if (!req.headers['content-type'].includes('application/json')) {
//     res.status(400).json({
//       'message': 'Content-type is not specified.'
//     });
//   } else {
//     let response = [];
//     let files = [];
//     try {
//       files = fs.readdirSync('avatars');
//     } catch (e) {
//       res.status(500).send('Something went wrong, please try again later.');
//     }
//     files.map(file => {
//       const url = req.protocol + '://' + req.get('host') + '/avatars/' + file;
//       let resItem = {};
//       resItem.image = url;
//       response.push(resItem);
//     });
//     res.status(200).json(response);
//   }
// });

module.exports = router;
