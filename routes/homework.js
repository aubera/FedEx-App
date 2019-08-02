const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Homework = require('../models/homeworks');
const Solution = require('../models/solutions')

router.get('/', (req, res) => {
  const id = req.query.id
  const classCode = req.query.classCode
  if (id === undefined) {
    Homework.find({ classCode })
      .then(homeworks => {
        res.status(200).json(homeworks);
      })
      .catch(() => res.status(403).json({ message: 'Bad Request' }))
  } else if (classCode === undefined) {
    Homework.find({ _id: id }).select('-__v ')
      .then(homework => {
        res.status(200).json(homework)})
      .catch(err => console.log(err))
  }

});

router.post('/solution', (req, res) => {
  if (req.headers['content-type'].includes('application/json')) {
    const content = req.body.content;
    const username = req.body.username
    const homeworkId = req.body.homeworkId
    const userPhoto = req.body.userPhoto
    if (content !== undefined && username !== undefined && homeworkId !== undefined) {
      Homework.findOne({ _id: homeworkId })
        .then(hw => {
          if (hw) {
            let alreadySubmittedStudents = hw.solutions.map(solution => solution.username)
            if (!alreadySubmittedStudents.includes(username)) {
              const solution = new Solution({ username: username, avatarPath: userPhoto, content: content })
              solution.save()
                .catch(err => console.log(err))
              hw.solutions.push(solution)
              hw.save()
                .then(response => res.status(200).json({message: 'solution added'}))
                .catch(err => console.log(err))
            } else {
              res.status(200).json({message: 'U have already submitted solution'})
            }
          }
          else {
            res.status(500).json({ message: 'Something went wrong, try again later' })
          }
        })
    } else {
      res.status(400).json({
        message: 'Content-type is not specified.'
      });
    }
  }
});

router.patch('/approve/:solutionId', (req, res) => {
  console.log('hello')
  if (req.headers['content-type'].includes('application/json')) {
    const solutionId = req.params.solutionId
    if (solutionId !== undefined) {
      Homework.findOne({ 'solutions._id': solutionId })
        .then((data) => {
          data.solutions.forEach(solution => {
            if (solution._id == solutionId) {
              solution.approved = 'true'
            }
          })
          data.save()
          console.log(data)
          res.status(200).json({message: 'approved'})
        }
        )
    } else {
      res.status(400).json({
        message: 'Content-type is not specified.'
      });
    }
  }
});

router.patch('/decline/:solutionId', (req, res) => {
  console.log('hello')
  if (req.headers['content-type'].includes('application/json')) {
    const solutionId = req.params.solutionId
    if (solutionId !== undefined) {
      Homework.findOne({ 'solutions._id': solutionId })
        .then((data) => {
          data.solutions.forEach(solution => {
            if (solution._id == solutionId) {
              solution.approved = 'false'
            }
          })
          data.save()
          console.log(data)
          res.status(200).json({message: 'approved'})
        }
        )
    } else {
      res.status(400).json({
        message: 'Content-type is not specified.'
      });
    }
  }
});



module.exports = router;
