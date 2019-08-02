const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Homework = require('../models/homeworks');
const Class = require('../models/classes')

router.post('/', (req, res) => {
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    const teacherName = req.body.homework.teacherName;
    const title = req.body.homework.title;
    const shortDesc = req.body.homework.shortDesc;
    const content = req.body.homework.content;
    const subject = req.body.homework.subject;
    const className = req.body.homework.className;
    const classCode = req.body.homework.classCode;
    const deadline = req.body.homework.deadline;

    if (title !== undefined && content !== undefined ) {
      const homework = new Homework({teacherName,title,shortDesc,content,subject,classCode,className,deadline});
      homework.save()
      .then(result =>{
        // console.log(homework);
        Class.update({code: classCode}, {$push: { homeworks : homework}})
          .then(pushResult=>{
            res.status(200).json({message: 'homework added'});
          })
          .catch(err => res.send(err))
      })
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
