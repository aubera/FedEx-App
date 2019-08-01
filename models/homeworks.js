const mongoose = require('mongoose');
const Solution = require('./solutions').schema;

const homeworkSchema = mongoose.Schema({
  deadline: {type: Date, required: true},
  created: { type: Date, required: true, default: Date.now()},
  subject: {type: String, required: true},
  teacherName: {type: String, required: true},
  className: {type: String, required: true},
  classCode: {type: String, required: true},
  solutions: {type: [Solution], default: []}
});

module.exports = mongoose.model('Homework', homeworkSchema);
