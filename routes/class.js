const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Class = require('../models/classes');

router.post('/', (req, res) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    const className = req.body.className;
    
    if (className !== undefined ) {
      
      const newClass = new Class({ name:className });
      newClass.save()
        .then(result => res.status(200).json({
          message: 'class added'
        }))
        .catch(err => res.send(err));
    } else {
      res.status(400).json({
        'message': `Missing class name`
      });
    }
  } else {
    res.status(415).json({
      message: 'Bad request header settings.'
    });
  }
});

router.get('/', (req, res) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    Class.find({})
      .then(classes => {
        res.status(200).json(classes);
      })
      .catch(error => {
        res.status(500).json({
          message: 'Something went wrong, please try again later.'
        });
      });
  } else {
    res.status(415).json({
      message: 'Bad request header settings.'
    });
  }
});

module.exports = router;
