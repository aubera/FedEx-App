const mongoose = require('mongoose');
const User = require('./users').schema;
const Homework = require('./homeworks').schema;

const classSchema = mongoose.Schema({
  name: { type: String, required: true},
  code: {type: Number, required: true},
  students: {type: [User], default: []},
  homeworks: {type: [Homework], default: []}
});

module.exports = mongoose.model('Class', classSchema);
