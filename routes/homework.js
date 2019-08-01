const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Homework = require('../models/homeworks');

router.get('/:classCode', (req, res) => {
  Homework.find({classCode: `${req.params.classCode}`})
    .then(homeworks => {
      res.status(200).json(homeworks);
    })
    .catch(() => res.status(403).json({message: 'Bad Request'}))
});

module.exports = router;