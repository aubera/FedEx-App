const mongoose = require('mongoose');

const solutionSchema = mongoose.Schema({
  username: {type: String, required: true},
  avatarPath: {type: String, required: true},
  content: {type: String, required: true},
  timestamp: { type: Date, required: true, default: Date.now()},
  approved: {type: String, enum: ['null', 'true', 'false'], default:'null'}
});

module.exports = mongoose.model('Solution', solutionSchema);
