const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Homework = require('../models/homeworks');


router.post('/', (req, res) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    const teacherName = req.body.teacherName;
    const title = req.body.title;
    const shortDesc = req.body.shortDesc;
    const content = req.body.content;
    const subject = req.body.subject;
    const className = req.body.className;
    const classCode = req.body.classCode;
    const deadline = req.body.deadline;
    if (title !== undefined && content !== undefined ) {
      const homework = new Homework({teacherName,title,shortDesc,content,subject,classCode,className,deadline});
      homework.save()
        .then(result => res.status(200).json({
          message: 'added homework'
        }))
        .catch(err => res.send(err));
    } else {
      let missingProperty = [];
      if (title === undefined) {
        missingProperty.push('title');
      }
      if (content === undefined) {
        missingProperty.push('content');
      }
      res.status(400).json({
        'message': `Missing ${missingProperty.join(' and ')}`
      });
    }
  } else {
    res.status(415).json({
      message: 'Bad request header settings.'
    });
  }
});

module.exports = router
