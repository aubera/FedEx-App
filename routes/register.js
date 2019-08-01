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
  } else if (!req.body.username || !req.body.password || req.body.code) {
    res.status(400).json({
      'message': `Missing field`
    });
  } else if (req.body.code !== '123456789') {
    Class.find({ code: req.body.code })
      .then(cl => {
        if (cl) {
          User.findOne({
            username: req.body.username
          })
            .then(user => {
              if (user) {
                return res.status(400).json({
                  'message': 'Username is already taken.'
                });
              } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                  if (err) {
                    res.status(500).send('Something went wrong, please try again later.');
                  } else {
                    const user = new User({
                      username: req.body.username,
                      password: hash,
                      role: 'student',
                      avatarPath: '/student.jpg',
                      classCode: req.body.code
                    });
                    user.save()
                      .then(result => res.status(200).json(result))
                      .catch(() => res.status(500).send('Something went wrong, please try again later.'));
                  }
                })
              }
            })
            .catch(() => res.status(500).send('Something went wrong, please try again later.'));
        }
        else {
          res.status(400).json({
            'message': `Wrong code`
          });
        }
      })
  } else {
    User.findOne({
      username: req.body.username
    })
      .then(user => {
        if (user) {
          return res.status(400).json({
            'message': 'Username is already taken.'
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              res.status(500).send('Something went wrong, please try again later.');
            } else {
              const user = new User({
                username: req.body.username,
                password: hash,
                role: 'teacher',
                avatarPath: '/teacher.jpg',
              });
              user.save()
                .then(result => res.status(200).json(result))
                .catch(() => res.status(500).send('Something went wrong, please try again later.'));
            }
          })
        }
      })
      .catch(() => res.status(500).send('Something went wrong, please try again later.'));
  }
});

module.exports = router;
