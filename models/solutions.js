const mongoose = require('mongoose');

const solutionSchema = mongoose.Schema({
  username: {type: String, required: true},
  content: {type: String, required: true},
  timestamp: { type: Date, required: true, default: Date.now()},
  approved: {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model('Solution', solutionSchema);
