const mongoose = require('mongoose');
const User = require('./users').schema;
const Homework = require('./homeworks').schema;

const classSchema = mongoose.Schema({
  name: { type: String, required: true},
  code: {type: Number, required: true, default: function() {return Math.floor(1000 + Math.random() * 9000)}, unique: true},
  students: {type: [User] },
  homeworks: {type: [Homework] }
});

module.exports = mongoose.model('Class', classSchema);
