'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();

const User = require('../models/users');

router.post('/', (req, res) => {
  if (!req.headers['content-type'].includes('application/json')) {
    res.status(400).json({
      'message': 'Content-type is not specified.'
    });
  } else if (!req.body.username || !req.body.password) {
    let missingProperty = '';
    if (!req.body.username && !req.body.password) {
      missingProperty = 'username and password';
    } else if (!req.body.username) {
      missingProperty = 'username';
    } else {
      missingProperty = 'password';
    }
    res.status(400).json({
      'message': `Missing ${missingProperty}`
    });
  } else {
    User.findOne({
      username: req.body.username
    }).select()
      .then(user => {
        bcrypt.compare(req.body.password, user.password, (err, resultOfPassCheck) => {

          //Error in the check password
          if (err) {
            return res.status(401).json({
              'message': 'Wrong username or password'
            });
          }

          //Correct password
          if (resultOfPassCheck) {
            res.status(200).json({
              '_id': user._id,
              'username': user.username,
              'avatarPath': user.avatarPath,
              'role': user.role,
              'classCode': user.classCode
            });
          }
          else {
            //Incorrect password
            return res.status(401).json({
              'message': 'Wrong username or password'

            });
          }
        });
      })
      .catch(() => {
        res.status(401).json({
          'message': 'Wrong username or password'
        });
      });
  }
});

module.exports = router;
